import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { useFocusEffect, useRoute } from '@react-navigation/native'
import { useEffect, useState } from "react";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { api } from '../services/api'
import { PoolPros } from '../components/PoolCard'
import { PoolHeader } from "../components/PoolHeader";
import { Share } from 'react-native'

interface RouteParams {
    id: string;
}

export function Details() {

    const [optionSelected, setOptionSelected] = useState<'Seus palpites' | 'Ranking do grupo'>('Seus palpites')

    const toast = useToast()

    const [isLoading, setIsLoading] = useState(false)

    const [poolDetails, setPooDetails] = useState<PoolPros>({} as PoolPros)

    const route = useRoute()

    const { id } = route.params as RouteParams


    async function fetchPoolsDetails() {
        try {
            setIsLoading(true)

            const response = await api.get(`/pools/${id}`)
            setPooDetails(response.data.pool)


        } catch (error) {
            console.log(error)

            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsLoading(false)
        }
    }

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        })
    }

    useEffect(() => {
        fetchPoolsDetails()
    }, [id])

    if (isLoading) {
        return <Loading />
    }


    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title={poolDetails.title} showBackButton showShareButton onShare={handleCodeShare} />

            {
                poolDetails._count?.participants > 0 ?
                    <VStack px={5} flex={1}>
                        <PoolHeader data={poolDetails} />

                        <HStack bgColor="gray.800" p={1} rounded='sm' mb={5}>

                            <Option title="Seus palpites" isSelected={optionSelected === 'Seus palpites'} onPress={() => setOptionSelected('Seus palpites')} />

                            <Option title="Ranking do Grupo" isSelected={optionSelected === 'Ranking do grupo'} onPress={() => setOptionSelected('Ranking do grupo')} />

                        </HStack>

                        <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                    </VStack>

                    : <EmptyMyPoolList code={poolDetails.code} />
            }
        </VStack>
    )
}