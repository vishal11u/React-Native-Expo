import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Attractions, Avatar, Hotels, NotFound, Restaurants } from "../assets";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MenuContainer from '../components/MenuContainer';
import { FontAwesome } from '@expo/vector-icons';
import { getPlacesData } from "../api";
import ItemCarDontainer from '../components/ItemCarDontainer';

const Discover = () => {
    const navigation = useNavigation();

    const [type, setType] = useState("restaurants");
    const [isLoading, setIsLoading] = useState(false);
    const [mainData, setMainData] = useState([]);
    const [bl_lat, setBl_lat] = useState(null);
    const [bl_lng, setBl_lng] = useState(null);
    const [tr_lat, setTr_lat] = useState(null);
    const [tr_lng, setTr_lng] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, type)
            .then((data) => {
                setMainData(data);
                setInterval(() => {
                    setIsLoading(false);
                }, 2000);
            });
    }, [bl_lat, bl_lng, tr_lat, tr_lng, type]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [])

    return (
        <SafeAreaView className="pt-7">
            <View className="flex-row items-center mt-3 justify-between px-8">
                <View>
                    <Text className="text-[35px] text-[#0B646B] font-bold">Discover</Text>
                    <Text className="text-[#527283] text-[30px]">the beauty today</Text>
                </View>

                <View className="w-20 h-20 bg-gray-400 rounded-md items-center justify-center shadow-lg">
                    <Image
                        source={Avatar}
                        className="w-full h-full rounded-md object-cover"
                    />
                </View>
            </View>

            <View className="flex-row items-center bg-white mx-4 rounded-xl py-1 px-4 shadow-lg mt-5">
                <GooglePlacesAutocomplete
                    GooglePlacesDetailsQuery={{ fields: "geometry" }}
                    placeholder="Search"
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(details?.geometry?.viewport);
                        setBl_lat(details?.geometry?.viewport?.southwest?.lat);
                        setBl_lng(details?.geometry?.viewport?.southwest?.lng);
                        setTr_lat(details?.geometry?.viewport?.northeast?.lat);
                        setTr_lng(details?.geometry?.viewport?.northeast?.lng);
                    }}
                    query={{
                        key: "AIzaSyDWpuVw2apN-XgX3gmrzHrZgr1AG4sCxQ",
                        language: "en",
                    }}
                />
            </View>

            {/* Menu Container */}
            {isLoading ? (
                <View className=" flex-1 items-center justify-center mt-[30%]">
                    <ActivityIndicator size="large" color="#0B646B" />
                </View>
            ) : (
                <ScrollView className="h-full">
                    <View className=" flex-row items-center justify-between px-8 mt-8">
                        <MenuContainer
                            key={"hotels"}
                            title="Hotels"
                            imageSrc={Hotels}
                            type={type}
                            setType={setType}
                        />

                        <MenuContainer
                            key={"attractions"}
                            title="Attractions"
                            imageSrc={Attractions}
                            type={type}
                            setType={setType}
                        />

                        <MenuContainer
                            key={"restaurants"}
                            title="Restaurants"
                            imageSrc={Restaurants}
                            type={type}
                            setType={setType}
                        />
                    </View>

                    <View>
                        <View className="flex-row items-center justify-between px-4 mt-8">
                            <Text className="text-[#2C7379] text-[28px] font-bold">
                                Top Tips
                            </Text>
                            <TouchableOpacity className="flex-row items-center justify-center space-x-2">
                                <Text className="text-[#A0C4C7] text-[20px] font-bold">
                                    Explore
                                </Text>
                                <FontAwesome
                                    name="long-arrow-right"
                                    size={24}
                                    color="#A0C4C7"
                                />
                            </TouchableOpacity>
                        </View>

                        <View className="px-3 w-full mt-8 flex-row items-center flex-wrap">
                            {mainData?.length > 0 ? (
                                <>
                                    {mainData?.map((data, i) => (
                                        <ItemCarDontainer
                                            key={i}
                                            imageSrc={
                                                data?.photo?.images?.medium?.url
                                                    ? data?.photo?.images?.medium?.url
                                                    : "https://cdn.pixabay.com/photo/2015/10/30/12/22/eat-1014025_1280.jpg"
                                            }
                                            title={data?.name}
                                            location={data?.location_string}
                                            data={data}
                                        />
                                    ))}
                                </>
                            ) : (
                                <>
                                    <View className="w-full h-[400px] items-center space-y-8 justify-center -mt-20">
                                        <Image
                                            source={NotFound}
                                            className=" w-32 h-32 object-cover"
                                        />
                                        <Text className="text-2xl text-[#428288] font-semibold">
                                            Opps...No Data Found
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    )
}

export default Discover;