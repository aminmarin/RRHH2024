import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Modal, TextInput, Button, Image, ScrollView } from 'react-native';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './Firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const GestionCandidatoScreen = ({ navigation }) => {
  const [candidatos, setCandidatos] = useState([]);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newExperience, setNewExperience] = useState({
    descripcion: '',
    empresa: '',
    fechainicio: '',
    fechafin: '',
    puesto: '',
    direccion: '',
  });

  useEffect(() => {
    fetchCandidatos();
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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'candidatos', id));
      Alert.alert('Candidato eliminado');
      fetchCandidatos();
    } catch (error) {
      console.log('Error al eliminar candidato:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const candidatoRef = doc(db, 'candidatos', selectedCandidato.id);
      await updateDoc(candidatoRef, selectedCandidato);
      Alert.alert('Candidato actualizado');
      setModalVisible(false);
      fetchCandidatos();
    } catch (error) {
      console.log('Error al actualizar candidato:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedCandidato((prev) => ({
        ...prev,
        imagen: result.assets[0].uri,
      }));
    }
  };

  const addExperience = () => {
    setSelectedCandidato((prev) => ({
      ...prev,
      experiencia: [...(prev.experiencia || []), newExperience],
    }));
    setNewExperience({
      descripcion: '',
      empresa: '',
      fechainicio: '',
      fechafin: '',
      puesto: '',
      direccion: '',
    });
  };

  const renderCandidatoItem = ({ item }) => (
    <View style={styles.candidatoContainer}>
      {item.imagen && <Image source={{ uri: item.imagen }} style={styles.profileImage} />}
      <View style={styles.candidatoInfo}>
        <Text style={styles.candidatoNombre}>Nombre: {item.nombre}</Text>
        <Text style={styles.candidatoEmail}>Email: {item.email}</Text>
        <Text style={styles.candidatoTelefono}>Teléfono: {item.telefono}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedCandidato(item);
            setModalVisible(true);
          }}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color="#FFF" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <MaterialIcons name="delete" size={20} color="#FFF" />
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={fetchCandidatos} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('RegistroCandidato')}
        >
          <Text style={styles.registerButtonText}>Registrar Candidato</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={candidatos}
        keyExtractor={(item) => item.id}
        renderItem={renderCandidatoItem}
      />

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Candidato</Text>

          <TouchableOpacity style={styles.documentButton} onPress={pickImage}>
            <Text style={styles.documentButtonText}>Cambiar Imagen de Perfil</Text>
          </TouchableOpacity>

          {selectedCandidato?.imagen && (
            <Image source={{ uri: selectedCandidato.imagen }} style={styles.profileImageLarge} />
          )}

          <TextInput
            placeholder="Nombre Completo"
            value={selectedCandidato?.nombre || ''}
            onChangeText={(text) =>
              setSelectedCandidato((prev) => ({ ...prev, nombre: text }))
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            value={selectedCandidato?.email || ''}
            onChangeText={(text) =>
              setSelectedCandidato((prev) => ({ ...prev, email: text }))
            }
            style={styles.input}
          />
          <TextInput
            placeholder="Teléfono"
            value={selectedCandidato?.telefono || ''}
            onChangeText={(text) =>
              setSelectedCandidato((prev) => ({ ...prev, telefono: text }))
            }
            style={styles.input}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Dirección"
            value={selectedCandidato?.direccion || ''}
            onChangeText={(text) =>
              setSelectedCandidato((prev) => ({ ...prev, direccion: text }))
            }
            style={styles.input}
          />

          <Text style={styles.sectionTitle}>Experiencia</Text>
          {selectedCandidato?.experiencia?.map((item, index) => (
            <View key={index} style={styles.experienceContainer}>
              <TextInput
                placeholder="Descripción"
                value={item.descripcion}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].descripcion = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Empresa"
                value={item.empresa}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].empresa = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Fecha Inicio"
                value={item.fechainicio}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].fechainicio = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Fecha Fin"
                value={item.fechafin}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].fechafin = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Puesto"
                value={item.puesto}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].puesto = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Dirección"
                value={item.direccion}
                onChangeText={(text) =>
                  setSelectedCandidato((prev) => {
                    const experiencia = [...prev.experiencia];
                    experiencia[index].direccion = text;
                    return { ...prev, experiencia };
                  })
                }
                style={styles.input}
              />
              <Button
                title="Eliminar Experiencia"
                color="red"
                onPress={() =>
                  setSelectedCandidato((prev) => ({
                    ...prev,
                    experiencia: prev.experiencia.filter((_, i) => i !== index),
                  }))
                }
              />
            </View>
          ))}
          <Button title="Agregar Experiencia" onPress={addExperience} />

          <View style={styles.actionButtons}>
            <Button title="Guardar Cambios" onPress={handleUpdate} />
            <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#5c67f2',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButton: {
    backgroundColor: '#34d399',
    padding: 10,
    borderRadius: 8,
  },
  registerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  candidatoContainer: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  candidatoInfo: {
    flex: 1,
  },
  candidatoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  candidatoEmail: {
    color: '#6b7280',
    marginTop: 5,
  },
  candidatoTelefono: {
    color: '#9ca3af',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionText: {
    color: '#FFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
  },
  documentButton: {
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});


export default GestionCandidatoScreen;
