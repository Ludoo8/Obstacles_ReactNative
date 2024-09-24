import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


type Obstacle = {
  name: string;
  description: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export default function ObstaclesScreen() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const loadObstacles = async () => {
        try {
          const storedObstacles = await AsyncStorage.getItem('obstacles');
          if (storedObstacles) {
            setObstacles(JSON.parse(storedObstacles));
          }
        } catch (error) {
          console.error('Erreur lors du chargement des obstacles', error);
        }
      };

      loadObstacles();
    }, [])
  );

  // fction delete
  const deleteObstacle = async (index: number) => {
    try {
      const newObstacles = [...obstacles];
      newObstacles.splice(index, 1); // suppr à l'index
      setObstacles(newObstacles);
      await AsyncStorage.setItem('obstacles', JSON.stringify(newObstacles));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'obstacle', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Liste des obstacles</Text>
      <FlatList
        data={obstacles}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
            <View>
              <Text>{item.name}</Text>
              <Text>{item.description}</Text>
              {item.coordinates && (
                <Text>
                  Latitude: {item.coordinates.latitude}, Longitude: {item.coordinates.longitude}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteObstacle(index)}>
              <Text style={{ color: 'red' }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Ajouter un obstacle" onPress={() => router.push('/add-obstacles')} />
    </View>
  );
}
