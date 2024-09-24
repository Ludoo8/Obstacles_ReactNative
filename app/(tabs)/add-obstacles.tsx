import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

type LocationType = {
  latitude: number;
  longitude: number;
} | null;

export default function AddObstacleScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<LocationType>(null);

  // fct coordonnées
  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de récupérer la localisation');
    }
  };

  useEffect(() => {
    getLocation(); // demande l'autorisation
  }, []);

  const addObstacle = async () => {
    if (name && description && location) {
      try {
        const newObstacle = { name, description, coordinates: location };

        const storedObstacles = await AsyncStorage.getItem('obstacles');
        const obstacles = storedObstacles ? JSON.parse(storedObstacles) : [];
        obstacles.push(newObstacle);
        await AsyncStorage.setItem('obstacles', JSON.stringify(obstacles));

        // remet à 0 les deux form
        setName('');
        setDescription('');

        Alert.alert('Succès', 'Obstacle ajouté avec succès');
        router.back(); // retour à l'accueil
      } catch (error) {
        Alert.alert('Erreur', 'Erreur lors de l\'ajout de l\'obstacle');
      }
    } else {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et activer la localisation');
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Nom de l'obstacle</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Text>Description de l'obstacle</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Ajouter" onPress={addObstacle} />
    </View>
  );
}
