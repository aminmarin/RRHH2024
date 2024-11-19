import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './Firebase/firebase';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const RegistroCandidatoScreen = ({ navigation }) => {
  const [candidato, setCandidato] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    genero: '', // Campo de género
    documento: [],
    experiencia: [],
    imagen: '',
  });

  const [newExperience, setNewExperience] = useState({
    descripcion: '',
    empresa: '',
    fechainicio: '',
    fechafin: '',
    puesto: '',
    direccion: '',
  });

  const [newDocument, setNewDocument] = useState(null);

  const handleCreateCandidato = async () => {
    // Validar que todos los campos requeridos estén completos
    if (!candidato.nombre.trim()) {
      Alert.alert('Error', 'El campo "Nombre Completo" es obligatorio.');
      return;
    }
    if (!candidato.email.trim()) {
      Alert.alert('Error', 'El campo "Email" es obligatorio.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(candidato.email)) {
      Alert.alert('Error', 'Por favor, ingresa un correo electrónico válido.');
      return;
    }
    if (!candidato.telefono.trim()) {
      Alert.alert('Error', 'El campo "Teléfono" es obligatorio.');
      return;
    }
    if (!/^\d{8,15}$/.test(candidato.telefono)) {
      Alert.alert('Error', 'Por favor, ingresa un número de teléfono válido.');
      return;
    }
    if (!candidato.direccion.trim()) {
      Alert.alert('Error', 'El campo "Dirección" es obligatorio.');
      return;
    }
    if (!candidato.genero) {
      Alert.alert('Error', 'Por favor, selecciona un género.');
      return;
    }

    try {
      await addDoc(collection(db, 'candidatos'), candidato);
      Alert.alert('Éxito', 'Candidato registrado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el candidato');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType, // Reemplaza MediaTypeOptions
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setCandidato((prevState) => ({
        ...prevState,
        imagen: result.assets[0].uri,
      }));
    }
  };
  
  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType, // Reemplaza MediaTypeOptions
      allowsEditing: true,
      quality: 1,
    });
  
    if (!result.canceled) {
      setNewDocument(result.assets[0].uri);
    }
  };
  const addDocument = () => {
    if (newDocument) {
      setCandidato((prevState) => ({
        ...prevState,
        documento: [...prevState.documento, newDocument],
      }));
      setNewDocument(null);
    }
  };

  const addExperience = () => {
    setCandidato((prevState) => ({
      ...prevState,
      experiencia: [...prevState.experiencia, newExperience],
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

  const removeExperience = (index) => {
    setCandidato((prevState) => ({
      ...prevState,
      experiencia: prevState.experiencia.filter((_, i) => i !== index),
    }));
  };

  return (
    <FlatList
      data={[1]}
      keyExtractor={(item) => item.toString()}
      renderItem={() => (
        <View style={styles.container}>
          <Text>Nombre Completo:</Text>
          <TextInput
            value={candidato.nombre}
            onChangeText={(text) => setCandidato({ ...candidato, nombre: text })}
            style={styles.input}
          />
          <Text>Email:</Text>
          <TextInput
            value={candidato.email}
            onChangeText={(text) => setCandidato({ ...candidato, email: text })}
            style={styles.input}
            keyboardType="email-address"
          />
          <Text>Teléfono:</Text>
          <TextInput
            value={candidato.telefono}
            onChangeText={(text) => setCandidato({ ...candidato, telefono: text })}
            style={styles.input}
            keyboardType="phone-pad"
          />
          <Text>Dirección:</Text>
          <TextInput
            value={candidato.direccion}
            onChangeText={(text) => setCandidato({ ...candidato, direccion: text })}
            style={styles.input}
          />

          <Text>Género:</Text>
          <Picker
            selectedValue={candidato.genero}
            onValueChange={(itemValue) => setCandidato({ ...candidato, genero: itemValue })}
            style={styles.input}
          >
            <Picker.Item label="Seleccionar género" value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Femenino" value="femenino" />
          </Picker>

          <Text style={styles.sectionTitle}>Imagen de Perfil:</Text>
          <TouchableOpacity style={styles.documentButton} onPress={pickImage}>
            <MaterialIcons name="attach-file" size={24} color="white" />
            <Text style={styles.documentButtonText}>Seleccionar Imagen</Text>
          </TouchableOpacity>
          {candidato.imagen ? (
            <Image source={{ uri: candidato.imagen }} style={styles.imagePreview} />
          ) : null}

          <Text style={styles.sectionTitle}>Experiencia:</Text>
          <TextInput
            placeholder="Descripción"
            value={newExperience.descripcion}
            onChangeText={(text) => setNewExperience({ ...newExperience, descripcion: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Empresa"
            value={newExperience.empresa}
            onChangeText={(text) => setNewExperience({ ...newExperience, empresa: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Fecha Inicio"
            value={newExperience.fechainicio}
            onChangeText={(text) => setNewExperience({ ...newExperience, fechainicio: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Fecha Fin"
            value={newExperience.fechafin}
            onChangeText={(text) => setNewExperience({ ...newExperience, fechafin: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Puesto"
            value={newExperience.puesto}
            onChangeText={(text) => setNewExperience({ ...newExperience, puesto: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Dirección"
            value={newExperience.direccion}
            onChangeText={(text) => setNewExperience({ ...newExperience, direccion: text })}
            style={styles.input}
          />
          <Button title="Agregar Experiencia" onPress={addExperience} />

          {candidato.experiencia.map((item, index) => (
            <View key={index} style={styles.experienceContainer}>
              <Text>Descripción: {item.descripcion}</Text>
              <Text>Empresa: {item.empresa}</Text>
              <Text>Fecha Inicio: {item.fechainicio}</Text>
              <Text>Fecha Fin: {item.fechafin}</Text>
              <Text>Puesto: {item.puesto}</Text>
              <Text>Dirección: {item.direccion}</Text>
              <TouchableOpacity onPress={() => removeExperience(index)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.registerButtonContainer}>
            <Button title="Registrar Candidato" onPress={handleCreateCandidato} />
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#BDBDBD',
    marginBottom: 10,
    fontSize: 16,
    padding: 5,
    color: '#424242',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#1976D2',
  },
  experienceContainer: {
    borderWidth: 1,
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10,
    marginVertical: 15,
  },
  documentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#F44336',
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerButtonContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
});

export default RegistroCandidatoScreen;
