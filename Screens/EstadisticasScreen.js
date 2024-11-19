import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './Firebase/firebase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const EstadisticasScreen = () => {
  const [vacantesData, setVacantesData] = useState({
    labels: ['Disponibles', 'No disponibles'],
    datasets: [{ data: [0, 0] }],
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const unsubscribe = onSnapshot(collection(db, 'vacantes'), (snapshot) => {
        let disponiblesCount = 0;
        let noDisponiblesCount = 0;

        snapshot.forEach((doc) => {
          const vacante = doc.data();
          console.log('Documento vacante:', vacante); // Verifica los datos de cada documento
          if (vacante.estado === 'Disponible') {
            disponiblesCount += 1;
          } else if (vacante.estado === 'No disponible') {
            noDisponiblesCount += 1;
          }
        });

        console.log({ disponiblesCount, noDisponiblesCount }); // Verifica los resultados en consola

        setVacantesData({
          labels: ['Disponibles', 'No disponibles'],
          datasets: [{ data: [disponiblesCount, noDisponiblesCount] }],
        });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      Alert.alert('Información', 'Los datos ya están sincronizados en tiempo real.');
    } catch (error) {
      console.error('Error al refrescar:', error);
    }
    setIsRefreshing(false);
  };

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #4CAF50; color: white; }
          </style>
        </head>
        <body>
          <h1>Reporte de Vacantes por Estado</h1>
          <table>
            <tr>
              <th>Estado</th>
              <th>Cantidad</th>
            </tr>
            <tr>
              <td>Disponibles</td>
              <td>${vacantesData.datasets[0].data[0]}</td>
            </tr>
            <tr>
              <td>No disponibles</td>
              <td>${vacantesData.datasets[0].data[1]}</td>
            </tr>
          </table>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir Reporte de Vacantes',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Error', 'No se puede compartir el archivo en este dispositivo.');
      }
    } catch (error) {
      console.log('Error al generar PDF:', error);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>📊 Estadísticas de Vacantes</Text>

      <Text style={styles.chartTitle}>Vacantes por Estado</Text>
      <BarChart
        data={vacantesData}
        width={Dimensions.get('window').width - 20}
        height={300}
        yAxisSuffix=""
        fromZero
        chartConfig={{
          backgroundGradientFrom: '#42A5F5',
          backgroundGradientTo: '#1E88E5',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        verticalLabelRotation={0}
        style={styles.chart}
      />

      <TouchableOpacity style={styles.button} onPress={generatePDF}>
        <Text style={styles.buttonText}>📄 Generar y Compartir Reporte PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#E65100',
    textAlign: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#424242',
    textAlign: 'center',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  button: {
    backgroundColor: '#FFA726',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default EstadisticasScreen;
