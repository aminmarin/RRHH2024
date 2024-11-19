import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Animated } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase/firebase';

const HomeScreen = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [asignados, setAsignados] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de opacidad

  useEffect(() => {
    fetchData();
    fadeIn();
  }, []);

  const fetchData = async () => {
    try {
      // Obtener candidatos
      const candidatosSnapshot = await getDocs(collection(db, 'candidatos'));
      setCandidatos(candidatosSnapshot.docs.map((doc) => doc.data()));

      // Obtener vacantes
      const vacantesSnapshot = await getDocs(collection(db, 'vacantes'));
      setVacantes(vacantesSnapshot.docs.map((doc) => doc.data()));

      // Obtener asignados
      const asignadosSnapshot = await getDocs(collection(db, 'asignaciones'));
      setAsignados(asignadosSnapshot.docs.map((doc) => doc.data()));
    } catch (error) {
      console.log('Error al obtener datos:', error);
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>📋 Resumen de Recursos Humanos</Text>
      
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>Vacantes Disponibles</Text>
        <Text style={styles.cardValue}>{vacantes.length}</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>Candidatos Registrados</Text>
        <Text style={styles.cardValue}>{candidatos.length}</Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.cardTitle}>Reportes Generados</Text>
        <Text style={styles.cardValue}>{asignados.length}</Text>
      </Animated.View>

      <Text style={styles.footer}>AMIN MARIN</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3F51B5',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    transform: [{ scale: 1 }],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  footer: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#757575',
    marginTop: 20,
    paddingBottom: 10,
  },
});

export default HomeScreen;
