import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import BgImage from '../../assets/weather-app-assets/images/bg.png'; 
import { theme } from '../themes/index.js';
import {MagnifyingGlassIcon} from 'react-native-heroicons/outline';
import {MapPinIcon, CalendarDaysIcon} from 'react-native-heroicons/solid';
import { useCallback, useState, useEffect } from 'react';
import PartlyCloudy from '../../assets/weather-app-assets/images/partlycloudy.png';
import {debounce} from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather.js';
import { weatherImages } from '../constants/index.js';
import * as Progress from 'react-native-progress';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loader, setLoader] = useState(false);

  const handleLocation = (loc) => {
    // setLoader(true);
    setLocations([]);
    toggleSearch(false);

    fetchWeatherForecast({
        cityName: loc.name,
        days: '7'
    }).then((data) => {
        setWeather(data);
        // setTimeout(() => {
        //     setLoader(false);
        // }, 3000);
    });
  }
  
  const handleSeach = (value) => {
    if(value.length > 2) {
        fetchLocations({
            cityName: value
        })
        .then((data) => {
            setLocations(data);
        });
    }
  }
  const handleTextDebounce = useCallback(debounce(handleSeach, 1200), []);

  const { current, location } = weather;

//   useEffect(() => {
//     fetchMyWeatherData();
//   });

//   const fetchMyWeatherData = async () => {
//     await fetchWeatherForecast({
//         cityName: 'Chicago',
//         days: '7'
//     })
//     .then((data) => {
//         setWeather(data);
//         // setTimeout(() => {
//         //     setLoader(false);
//         // }, 3000);
//     });
//   }

  return (
    <View className="flex-1 relative">
        <StatusBar style="light" />
        <Image blurRadius={70} source={BgImage} className="absolute h-full w-full" />
        {
            loader ?
            <View className="text-white text-lg">
                <Text>Loading...</Text>
            </View>
            :
            <SafeAreaView className="flex flex-1">
                {/* search button */}
                <View style={{height: '7%'}} className='mx-4 relative z-50'>
                    {/* place search field */}
                    <View className='flex-row justify-end items-center rounded-full overflow-hidden' style={{backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent'}}>
                        {
                            showSearch ? (
                                <TextInput
                                    onChangeText={handleTextDebounce}
                                    placeholder='Search City' 
                                    placeholderTextColor={'lightgray'}
                                    className='pl-6 h-10 pb-1 flex-1 text-base text-white'
                                />
                            ) : null
                        }
                        <TouchableOpacity
                            onPress={() => toggleSearch(!showSearch)}
                            style={{backgroundColor: theme.bgWhite(0.3)}}
                            className='rounded-full p-3 m-1'
                        >
                            <MagnifyingGlassIcon size={25} color='white' /> 
                        </TouchableOpacity>
                    </View>
                    
                    {/* places options */}
                    {
                        locations.length > 0 && showSearch ? (
                            <View className='absolute w-full bg-gray-300 top-16 rounded-3xl'>
                                {
                                    locations.map((location, index) => {
                                        let showBorder = index + 1 != locations.length;
                                        let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                                        return (
                                            <TouchableOpacity
                                            onPress={() => handleLocation(location)}
                                                key={index}
                                                className={'flex flex-row items-center border-0 p-3 px-4 mb-1' + borderClass}
                                            >
                                                <MapPinIcon size={20} color='gray' />
                                                <View className='flex-1 ml-2'>
                                                    <Text className='text-black text-lg' numberOfLines={1} ellipsizeMode='tail'>
                                                        {location?.name ?? 'N/A'}, {location.country ?? 'N/A'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : null
                    }
                </View>

                {/* forecast section */}
                <View className='mx-4 flex justify-around flex-1 mb-2'>
                    {/* location */}
                    <Text className='text-white text-center text-2xl font-bold'>
                        {location?.name ?? 'N/A'},
                        <Text className='text-lg font-semibold text-gray-300'>
                            {' ' + location?.country}
                        </Text>
                    </Text>

                    {/* weather image */}
                    <View className='flex-row justify-center'>
                        <Image 
                            source={
                                current?.condition?.icon
                                ? weatherImages[current?.condition?.text]
                                : PartlyCloudy
                            } 
                            // source={{uri: 'https:' + current?.condition?.icon}}
                            className='w-52 h-52'
                        />
                    </View>

                    {/* degree celsius */}
                    <View className='gap-y-2'>
                        <Text className='text-center font-bold text-white text-6xl ml-5'>
                            {current?.temp_f ?? 0}&#176;
                        </Text>
                        <Text className='text-center text-white text-xl tracking widest'>
                            {current?.condition?.text ?? 'N/A'}
                        </Text>
                    </View>

                    {/* other stats */}
                    <View className='flex-row justify-between mx-4'>
                        <View className='flex-row gap-2 items-center'>
                            <Image source={require('../../assets/weather-app-assets/icons/wind.png')} className='h-6 w-6' />
                            <Text className='text-white font-semibold text-base'>
                                {current?.wind_mph ?? 0} mph
                            </Text>
                        </View>
                        <View className='flex-row gap-2 items-center'>
                            <Image source={require('../../assets/weather-app-assets/icons/drop.png')} className='h-6 w-6' />
                            <Text className='text-white font-semibold text-base'>
                                {current?.humidity ?? 0}%
                            </Text>
                        </View>
                        <View className='flex-row gap-2 items-center'>
                            <Image source={require('../../assets/weather-app-assets/icons/sun.png')} className='h-6 w-6' />
                            <Text className='text-white font-semibold text-base'>
                                6:05 AM
                            </Text>
                        </View>
                    </View>
                </View>

                {/* forecast for next days */}
                <View className='mb-2 gap-y-3'>
                    <View className='flex-row items-center mx-5 gap-2'>
                        <CalendarDaysIcon size={22} color='white' />
                        <Text className='text-white text-base flex-1'>Daily Forecast</Text> 
                    </View>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{paddingHorizontal: 15}}
                        showsHorizontalScrollIndicator={false}
                    >
                        {
                            weather?.forecast?.forecastday
                            ? weather?.forecast?.forecastday?.map((item, index) => {
                                // const dateString = item?.date;
                                // console.log(item?.date, typeof dateString);
                                // // Replace hyphens with slashes so JS parses it as local time
                                // const fixedDateString = dateString.replace(/-/g, '/');
                                // const date = new Date(fixedDateString);
                                // const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

                                const dateString = item?.date;

                                let dayName = '';
                                if (dateString) {
                                    // Split "2026-10-19" into [ "2026", "10", "19" ]
                                    const [year, month, day] = dateString.split('-');
                                    
                                    // Note: JavaScript months are 0-indexed (0 = January, 9 = October), so we do month - 1
                                    const date = new Date(year, month - 1, day);
                                    
                                    dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                                }

                                return (
                                    <View
                                        key={index}
                                        className='flex justify-center items-center w-24 rounded-3xl py-3 gap-y-1 mr-4'
                                        style={{backgroundColor: theme.bgWhite(0.15)}}
                                    >
                                        <Image source={
                                                index
                                                ? weatherImages[item?.day?.condition?.text]
                                                : PartlyCloudy
                                            }  
                                            className='h-11 w-11'
                                        />
                                        <Text className='text-white text-center w-full'>{dayName}</Text>
                                        <Text className='text-white text-xl font-semibold text-center w-full'>{item?.day?.avgtemp_f}&#176;</Text>
                                    </View>
                                );
                            })
                            : []
                        }
                    </ScrollView>
                </View>
            </SafeAreaView>
        }
    </View>
  );
}
