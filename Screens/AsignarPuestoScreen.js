import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './Firebase/firebase';

const AsignarPuestoScreen = () => {
  const [candidatos, setCandidatos] = useState([]);
  const [vacantes, setVacantes] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [selectedVacanteId, setSelectedVacanteId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCandidatos();
    fetchVacantes();
  }, []);

  const fetchCandidatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'candidatos'));
      const candidatosList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCandidatos(candidatosList);
    } catch (error) {
      console.log('Error al obtener candidatos:', error);
    }
  };

  const fetchVacantes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'vacantes'));
      const vacantesList = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setVacantes(vacantesList);
    } catch (error) {
      console.log('Error al obtener vacantes:', error);
    }
  };

  const asignarPuesto = async () => {
    if (!selectedCandidato || !selectedVacanteId) {
      Alert.alert('Error', 'Debe seleccionar un candidato y una vacante');
      return;
    }

    try {
      const vacante = vacantes.find((v) => v.id === selectedVacanteId);
      const candidatoRef = doc(db, 'candidatos', selectedCandidato.id);
      await updateDoc(candidatoRef, {
        puestoAsignado: vacante.titulo,
        idVacante: selectedVacanteId,
      });
      Alert.alert('Éxito', 'Puesto asignado correctamente');
      setModalVisible(false);
      setSelectedCandidato(null);
      setSelectedVacanteId(null);
      fetchCandidatos();
    } catch (error) {
      console.log('Error al asignar puesto:', error);
      Alert.alert('Error', 'No se pudo asignar el puesto');
    }
  };

  const renderCandidato = ({ item }) => (
    <TouchableOpacity
      style={styles.candidatoContainer}
      onPress={() => {
        setSelectedCandidato(item);
        setModalVisible(true);
      }}
    >
      <Text style={styles.candidatoNombre}>{item.nombre}</Text>
      <Text style={styles.candidatoPuesto}>
        Puesto asignado: {item.puestoAsignado || 'Sin asignar'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Asignar Puesto a Candidato</Text>
      <FlatList
        data={candidatos}
        keyExtractor={(item) => item.id}
        renderItem={renderCandidato}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Asignar Vacante a {selectedCandidato?.nombre}
            </Text>
            <Picker
              selectedValue={selectedVacanteId}
              onValueChange={(itemValue) => setSelectedVacanteId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione una vacante" value={null} />
              {vacantes.map((vacante) => (
                <Picker.Item key={vacante.id} label={vacante.titulo} value={vacante.id} />
              ))}
            </Picker>
            <TouchableOpacity style={styles.button} onPress={asignarPuesto}>
              <Text style={styles.buttonText}>Asignar Puesto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6', // Fondo claro moderno
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937', // Azul oscuro
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
  candidatoContainer: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: '#2563eb', // Azul para diferenciar candidatos
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  candidatoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  candidatoPuesto: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo translúcido
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#1f2937',
  },
  picker: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  button: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#10b981', // Verde para acciones positivas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ef4444', // Rojo para cancelar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AsignarPuestoScreen;
