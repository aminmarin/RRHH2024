import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './Firebase/firebase';
import { Ionicons } from '@expo/vector-icons';

const CatalogoVacantesScreen = ({ navigation }) => {
  const [vacantes, setVacantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacantes();

    // Configuración de los botones en la esquina superior derecha
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity onPress={fetchVacantes} style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegistroVacante')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const fetchVacantes = async () => {
    setLoading(true); // Mostrar el indicador de carga
    try {
      const querySnapshot = await getDocs(collection(db, 'vacantes'));
      const vacantesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id, // Asegurarse de incluir el ID correcto
        ...docSnap.data(),
      }));
      setVacantes(vacantesList);
    } catch (error) {
      console.log('Error al obtener vacantes:', error);
    } finally {
      setLoading(false); // Ocultar el indicador de carga
    }
  };

  const handleDeleteVacante = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta vacante?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'vacantes', id));
              Alert.alert('Éxito', 'Vacante eliminada correctamente');
              fetchVacantes(); // Actualiza la lista después de eliminar
            } catch (error) {
              console.log('Error al eliminar vacante:', error);
              Alert.alert('Error', 'No se pudo eliminar la vacante');
            }
          },
        },
      ]
    );
  };

  const renderVacanteItem = ({ item }) => (
    <View
      style={[
        styles.vacanteContainer,
        { borderLeftColor: item.estado === 'Disponible' ? 'green' : 'red' },
      ]}
    >
      <TouchableOpacity
        style={styles.vacanteInfo}
        onPress={() => {
          if (item.id) {
            navigation.navigate('DetalleVacante', { vacanteId: item.id });
          } else {
            Alert.alert('Error', 'No se proporcionó un ID válido de vacante.');
          }
        }}
      >
        <Text style={styles.vacanteTitulo}>{item.titulo}</Text>
        <Text style={styles.vacanteUbicacion}>{item.ubicacion}</Text>
        <Text style={styles.vacanteEstado}>Estado: {item.estado}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteVacante(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Catálogo de Vacantes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1e88e5" />
      ) : (
        <FlatList
          data={vacantes}
          keyExtractor={(item) => item.id}
          renderItem={renderVacanteItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6', // Fondo claro y limpio
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1f2937', // Color más oscuro para el encabezado
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 10,
    color: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  refreshButton: {
    marginRight: 10,
    padding: 8,
    backgroundColor: '#34d399', // Botón verde vibrante
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    backgroundColor: '#34d399', // Botón verde vibrante
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vacanteContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    borderLeftWidth: 6, // Línea indicadora de estado
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vacanteInfo: {
    flex: 1, // Toma todo el espacio disponible menos el botón
  },
  vacanteTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb', // Azul moderno para destacar títulos
  },
  vacanteUbicacion: {
    fontSize: 16,
    color: '#4b5563', // Gris oscuro para información secundaria
    marginTop: 5,
  },
  vacanteEstado: {
    fontSize: 14,
    color: '#9ca3af', // Gris claro e italizado
    fontStyle: 'italic',
    marginTop: 5,
  },
  deleteButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CatalogoVacantesScreen;
