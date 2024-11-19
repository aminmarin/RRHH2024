import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './Firebase/firebase';

const RegistroVacanteScreen = ({ navigation }) => {
  const [vacante, setVacante] = useState({
    titulo: '',
    descripcion: '',
    salario: '',
    tipoempleo: '',
    ubicacion: '',
    estado: 'Disponible', // Campo de estado inicializado
    Requisitos: [],
  });

  const [nuevoRequisito, setNuevoRequisito] = useState({
    Nombre: '',
    Descripcion: '',
    Nivel: '',
    AñosExperiencia: '',
    Certificacion: '',
    Obligatorio: false,
    idioma: '',
  });

  const agregarRequisito = () => {
    if (!nuevoRequisito.Nombre || !nuevoRequisito.Descripcion || !nuevoRequisito.Nivel) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos del requisito');
      return;
    }
    setVacante((prevVacante) => ({
      ...prevVacante,
      Requisitos: [...prevVacante.Requisitos, nuevoRequisito],
    }));
    setNuevoRequisito({
      Nombre: '',
      Descripcion: '',
      Nivel: '',
      AñosExperiencia: '',
      Certificacion: '',
      Obligatorio: false,
      idioma: '',
    });
  };

  const handleSubmit = async () => {
    if (
      !vacante.titulo ||
      !vacante.descripcion ||
      !vacante.salario ||
      !vacante.tipoempleo ||
      !vacante.ubicacion ||
      vacante.Requisitos.length === 0
    ) {
      Alert.alert('Error', 'Todos los campos son obligatorios y debes agregar al menos un requisito');
      return;
    }

    try {
      await addDoc(collection(db, 'vacantes'), vacante);
      Alert.alert('Éxito', 'Vacante registrada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la vacante');
      console.log('Error al registrar vacante:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Registro de Vacante</Text>
        <TextInput
          placeholder="Título de la vacante"
          value={vacante.titulo}
          onChangeText={(text) => setVacante({ ...vacante, titulo: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Descripción"
          value={vacante.descripcion}
          onChangeText={(text) => setVacante({ ...vacante, descripcion: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Salario"
          value={vacante.salario}
          onChangeText={(text) => setVacante({ ...vacante, salario: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Tipo de Empleo"
          value={vacante.tipoempleo}
          onChangeText={(text) => setVacante({ ...vacante, tipoempleo: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Ubicación"
          value={vacante.ubicacion}
          onChangeText={(text) => setVacante({ ...vacante, ubicacion: text })}
          style={styles.input}
        />

        {/* Selector de estado de la vacante */}
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Estado: {vacante.estado}</Text>
          <Switch
            value={vacante.estado === 'Disponible'}
            onValueChange={(value) =>
              setVacante((prevVacante) => ({
                ...prevVacante,
                estado: value ? 'Disponible' : 'No Disponible',
              }))
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Agregar Requisito</Text>
        <TextInput
          placeholder="Nombre del requisito"
          value={nuevoRequisito.Nombre}
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, Nombre: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Descripción del requisito"
          value={nuevoRequisito.Descripcion}
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, Descripcion: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Nivel (Básico, Intermedio, Avanzado)"
          value={nuevoRequisito.Nivel}
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, Nivel: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Años de Experiencia"
          value={nuevoRequisito.AñosExperiencia}
          keyboardType="numeric"
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, AñosExperiencia: parseInt(text) || 0 })}
          style={styles.input}
        />
        <TextInput
          placeholder="Certificación (si aplica)"
          value={nuevoRequisito.Certificacion}
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, Certificacion: text })}
          style={styles.input}
        />
        <TextInput
          placeholder="Idioma (si aplica)"
          value={nuevoRequisito.idioma}
          onChangeText={(text) => setNuevoRequisito({ ...nuevoRequisito, idioma: text })}
          style={styles.input}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Obligatorio:</Text>
          <Switch
            value={nuevoRequisito.Obligatorio}
            onValueChange={(value) => setNuevoRequisito({ ...nuevoRequisito, Obligatorio: value })}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={agregarRequisito}>
          <Text style={styles.buttonText}>Agregar Requisito</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Requisitos Agregados:</Text>
        {vacante.Requisitos.map((item, index) => (
          <View key={index} style={styles.requisitoContainer}>
            <Text style={styles.requisitoText}>
              - {item.Nombre} (Nivel: {item.Nivel}, Años de Experiencia: {item.AñosExperiencia})
            </Text>
            <Text style={styles.requisitoDescripcion}>{item.Descripcion}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Registrar Vacante</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1f2937',
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
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#1f2937',
  },
  requisitoContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  requisitoText: {
    fontSize: 16,
    color: '#2563eb',
  },
  requisitoDescripcion: {
    color: '#4b5563',
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegistroVacanteScreen;
