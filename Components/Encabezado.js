import React from "react";
import { View,Text, StyleSheet } from "react-native";

export default function Encabezado() {
    return (
        <View style={estilos.contenedor}>
          <Text style={estilos.texto}>Bienvenido!</Text>
        </View>
      );
    }
    
    // Definición de estilos para el Encabezado
    const estilos = StyleSheet.create({
      contenedor: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
      },
      texto: {
        fontSize: 28,
        color: 'Blue',
        fontWeight: 'white',
      },
    });