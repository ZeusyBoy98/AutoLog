import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from 'expo-location';

export default function Create() {
    const [user, setUser] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [depTime, setDepTime] = useState("");
    const [arrTime, setArrTime] = useState("")
    const [date, setDate] = useState("");
    const [logs, setLogs] = useState([]);
    const [arrLoading, setArrLoading] = useState(false);
    const [depLoading, setDepLoading] = useState(false);
    const [displayDep, setDisplayDep] = useState(null);
    const [displayArr, setDisplayArr] = useState(null);

    const getDepLocation = async () => {
        setDepLoading(true);
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
            setDepLoading(false);
            return;
          }
    
          let loc = await Location.getCurrentPositionAsync({});
    
          let addr = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
    
          if (addr.length > 0) {
            const a = addr[0];
            const notReadable = `${a.name || ''}, ${a.street}, ${a.city || ''}, ${a.region || ''}, ${a.postalCode || ''}, ${a.country || ''}`;
            const readable = `${a.name || ''}, ${a.city || ''}`;
            setDisplayDep(readable);
            setDeparture(notReadable);
          }
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'Could not fetch location.');
        } finally {
          setDepLoading(false);
        }
    };

    const getArrLocation = async () => {
        setArrLoading(true);
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
            setArrLoading(false);
            return;
          }
    
          let loc = await Location.getCurrentPositionAsync({});
    
          let addr = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
    
          if (addr.length > 0) {
            const a = addr[0];
            const notReadable = `${a.name || ''}, ${a.street}, ${a.city || ''}, ${a.region || ''}, ${a.postalCode || ''}, ${a.country || ''}`;
            const readable = `${a.name || ''}, ${a.city || ''}`;
            setDisplayArr(readable);
            setArrival(notReadable)
          }
        } catch (err) {
          console.error(err);
          Alert.alert('Error', 'Could not fetch location.');
        } finally {
          setArrLoading(false);
        }
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("Logs");
                if (jsonValue !== null) {
                    setLogs(JSON.parse(jsonValue));
                }
            } catch (e) {
                console.error(e);
            }
        };
        loadData();
    }, []);

    const addLog = async () => {
        if (user.trim() && departure.trim() && arrival.trim() && depTime.trim() && arrTime.trim() && date.trim()) {
            const highestId = logs.length > 0 ? Math.max(...logs.map(log => log.id)) : 0;
            const newId = highestId + 1;

            const newLogs = [
                { id: newId, user, departure, arrival, depTime, arrTime, date},
                ...logs,
            ];
            setLogs(newLogs);

            try {
                await AsyncStorage.setItem("Logs", JSON.stringify(newLogs));
            } catch (e) {
                console.error(e);
            }

            setUser("");
            setDeparture("");
            setArrival("");
            setDepTime("");
            setArrTime("");
            setDate("");
        }
        router.push('/(tabs)/logbook');
    }

    function getCurrentTime(setter) {
        const currentdate = new Date(); 
        const formattedTime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
        setter(formattedTime);
    }    

    return (
        <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10} style={styles.container}>
                <Text style={styles.title}>Create Log</Text>
                <TextInput
                    style={styles.input}
                    maxLength={10}
                    placeholder="User"
                    placeholderTextColor={"black"}
                    value={user}
                    onChangeText={setUser}
                />
                <Text>Departure:</Text>
                <View style={styles.way}>
                    <View style={{}}>
                        <Pressable onPress={() => {getDepLocation()}} style={styles.button}>
                            <Text style={styles.createText}>Get Departure</Text>
                        </Pressable>
                        {depLoading && <ActivityIndicator style={{}} />}
                        {displayDep && (
                            <View style={{marginBottom: 10}}>
                                <Text style={styles.location}>{displayDep}</Text>
                            </View>
                        )}
                    </View>
                    <View>
                        <Pressable onPress={() => getCurrentTime(setDepTime)} style={styles.button}>
                            <Text style={styles.createText}>Get Time</Text>
                        </Pressable>
                        <Text style={styles.time}>Departure Time: {depTime}</Text>
                    </View>
                </View>
                <Text>Arrival:</Text>
                <View style={styles.way}>
                    <View style={{}}>
                        <Pressable onPress={() => { getArrLocation() }} style={styles.button}>
                            <Text style={styles.createText}>Get Arrival</Text>
                        </Pressable>
                        {arrLoading && <ActivityIndicator style={{}} />}
                        {displayArr && (
                            <View style={{marginBottom: 10}}>
                                <Text style={styles.location}>{displayArr}</Text>
                            </View>
                        )}
                    </View>
                    <View>
                        <Pressable onPress={() => getCurrentTime(setArrTime)} style={styles.button}>
                            <Text style={styles.createText}>Get Time</Text>
                        </Pressable>
                        <Text style={styles.time}>Arrival Time: {arrTime}</Text>
                    </View>
                </View>
                <Pressable onPress={addLog} style={styles.createButton}>
                    <Text style={styles.createText}>Create</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    marginTop: "20%",
    fontSize: 50,
    fontWeight: "bold",
  },
  way: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 5,
  },
  createButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
  },
  createText: {
    color: "white",
    fontSize: 20,
  }
})