import React, { useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import styles from './styles';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1); // Não existe pag 0
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  function navigateToDetail(incident) {
    // Envia os dados do incident para a pág que estamos navegando
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents() {
    if (loading) {
      // evita que outra requisição seja feita
      // enquanto a que estiver sendo atendida
      // ainda estiver em execução
      return;
    }

    if (total > 0 && incidents.length === total) {
      // Se já carregou algo, e se já carregou tudo, 
      // não faz sentido buscar mais informações
      return;
    }

    setLoading(true);

    const response = await api.get('incidents', {
      params: { page }
    });

    // Para não sobrepor a coleção que já tínhamos,
    // e perder a informação, anexamos a anterior
    // com a nova
    setIncidents([...incidents, ...response.data]);

    setTotal(response.headers['x-total-count']);
    setPage(page + 1);
    setLoading(false);
  }

  // Toda vez que precisamos carregar informações
  // assim que o componente é exibido em tela, usa-se o
  // useEffect. A função será disparada sempre que os valores
  // constantes no array forem modificadas.

  useEffect(() => {
    loadIncidents();
  }, []);
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>.
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        // showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(incident.value)}
            </Text>

            <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />            
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}