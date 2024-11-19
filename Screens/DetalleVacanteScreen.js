import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './Firebase/firebase';

const DetalleVacanteScreen = ({ route, navigation }) => {
  const { vacanteId } = route.params; // ID del documento de Firebase
  const [vacante, setVacante] = useState(null);
  const [candidatos, setCandidatos] = useState([]);
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vacanteId) {
      Alert.alert('Error', 'No se proporcionó un ID válido de vacante.');
      navigation.goBack();
      return;
    }

    fetchVacante();
    fetchCandidatos();

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteVacante(vacanteId)}
        >
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const fetchVacante = async () => {
    try {
      const vacanteDocRef = doc(db, 'vacantes', vacanteId);
      const vacanteDoc = await getDoc(vacanteDocRef);

      if (vacanteDoc.exists()) {
        const vacanteData = vacanteDoc.data();
        setVacante(vacanteData);
        setEstado(vacanteData.estado || '');
      } else {
        Alert.alert('Error', 'No se encontró la vacante seleccionada.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error al obtener la vacante:', error);
      Alert.alert('Error', 'Hubo un problema al cargar la vacante.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'candidatos'));
      const candidatosList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCandidatos(candidatosList);
    } catch (error) {
      console.error('Error al obtener candidatos:', error);
    }
  };

  const toggleDisponibilidad = async () => {
    const nuevoEstado = estado === 'Disponible' ? 'No Disponible' : 'Disponible';

    try {
      const vacanteRef = doc(db, 'vacantes', vacanteId);
      await updateDoc(vacanteRef, { estado: nuevoEstado });
      setEstado(nuevoEstado);
      Alert.alert('Estado actualizado', `La vacante está ahora ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      Alert.alert('Error', 'No se pudo actualizar el estado de la vacante.');
    }
  };

  const handleAsignarCandidato = async (candidato) => {
    try {
      const candidatoRef = doc(db, 'candidatos', candidato.id);
      await updateDoc(candidatoRef, {
        puestoAsignado: vacante.titulo,
        idVacante: vacanteId,
      });
      Alert.alert('Éxito', `${candidato.nombre} fue asignado a la vacante ${vacante.titulo}`);
      fetchCandidatos(); // Actualizar la lista de candidatos
    } catch (error) {
      console.error('Error al asignar candidato:', error);
      Alert.alert('Error', 'No se pudo asignar el candidato.');
    }
  };

  const handleDeleteVacante = async (id) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta vacante?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              const vacanteRef = doc(db, 'vacantes', id);
              await deleteDoc(vacanteRef);
              Alert.alert('Éxito', 'Vacante eliminada correctamente.');
              navigation.goBack();
            } catch (error) {
              console.error('Error al eliminar vacante:', error);
              Alert.alert('Error', 'No se pudo eliminar la vacante.');
            }
          },
        },
      ]
    );
  };

  const renderRequisitoItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>- {item.Nombre}</Text>
      <Text style={styles.cardDetail}>Descripción: {item.Descripcion}</Text>
      <Text style={styles.cardDetail}>Nivel: {item.Nivel}</Text>
      <Text style={styles.cardDetail}>Años de Experiencia: {item.AñosExperiencia}</Text>
    </View>
  );

  const renderCandidatoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: '#d1fae5' }]}
      onPress={() => handleAsignarCandidato(item)}
    >
      <Text style={styles.cardTitle}>{item.nombre}</Text>
      <Text style={styles.cardDetail}>Puesto Asignado: {item.puestoAsignado || 'Sin asignar'}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#2563eb" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {vacante && (
        <>
          <Text style={styles.sectionTitle}>Detalles de la Vacante</Text>
          <Text style={styles.vacanteTitulo}>Título: {vacante.titulo}</Text>
          <Text style={styles.vacanteDescripcion}>Descripción: {vacante.descripcion}</Text>
          <Text style={styles.vacanteSalario}>Salario: {vacante.salario}</Text>
          <Text style={styles.vacanteTipoEmpleo}>Tipo de Empleo: {vacante.tipoempleo}</Text>
          <Text style={styles.vacanteUbicacion}>Ubicación: {vacante.ubicacion}</Text>
          <Text style={styles.vacanteEstado}>Estado: {estado}</Text>

          <Button
            title={estado === 'Disponible' ? 'Marcar como No Disponible' : 'Marcar como Disponible'}
            color={estado === 'Disponible' ? 'red' : 'green'}
            onPress={toggleDisponibilidad}
          />

          <Text style={styles.sectionTitle}>Requisitos</Text>
          {vacante.Requisitos?.length > 0 ? (
            <FlatList
              data={vacante.Requisitos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderRequisitoItem}
            />
          ) : (
            <Text style={styles.noDataText}>No hay requisitos especificados.</Text>
          )}
        </>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Candidatos Disponibles</Text>
      {candidatos.length > 0 ? (
        <FlatList
          data={candidatos}
          keyExtractor={(item) => item.id}
          renderItem={renderCandidatoItem}
          style={styles.candidatosList}
        />
      ) : (
        <Text style={styles.noDataText}>No hay candidatos disponibles.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25, // Espaciado entre secciones
    color: '#2563eb',
  },
  vacanteTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  vacanteDescripcion: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 15,
    lineHeight: 20,
  },
  vacanteSalario: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 15,
  },
  card: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cardDetail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#9ca3af',
  },
  deleteButton: {
    marginRight: 15,
    padding: 5,
  },
  candidatosList: {
    marginTop: 10, 
    paddingBottom: 20,
  },
});

export default DetalleVacanteScreen;
