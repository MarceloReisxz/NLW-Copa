import { VStack, Icon, useToast, FlatList } from "native-base";
import { Button } from "../components/Button";
import React from "react";
import { Header } from "../components/Header";
import { Octicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, NavigationHelpersContext } from '@react-navigation/native'
import { api } from "../services/api";
import { useCallback } from 'react'
import { PoolCard, PoolPros } from '../components/PoolCard'
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { useState } from 'react'


export function Pools() {
    const [isLoading, setIsLoading] = useState(true)

    const [pools, setPools] = useState<PoolPros[]>([])

    const toast = useToast()

    const navigation = useNavigation()


    async function fetchPools() {
        try {
            setIsLoading(true)

            const response = await api.get('/pools')
            setPools(response.data.pools)


        } catch (error) {
            console.log(error)
            toast.show({
                title: 'Não foi possível carregar os bolões',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchPools()
    }, []))

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Meus bolões" />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
                <Button title="BUSCAR BOLÃO POR CÓDIGO" leftIcon={<Icon as={Octicons} name="search" color="black" size="md" onPress={() => navigation.navigate('find')} />} />
            </VStack>

            {
                isLoading ? <Loading /> :
                    <FlatList
                        data={pools}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <PoolCard
                                data={item}
                                onPress={() => navigation.navigate('details', { id: item.id })}
                            />)}
                        showsVerticalScrollIndicator={false}
                        _contentContainerStyle={{ pb: 10 }}
                        ListEmptyComponent={() => <EmptyPoolList />}
                        px={5}
                    />

            }


        </VStack>
    )
}