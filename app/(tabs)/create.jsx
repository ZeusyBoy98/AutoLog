import { Text, View, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, TouchableWithoutFeedback } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Create() {
    const [user, setUser] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [depTime, setDepTime] = useState("");
    const [arrTime, setArrTime] = useState("")
    const [date, setDate] = useState("");
    const [logs, setLogs] = useState([]);

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
                <View style={{flexDirection: "row", gap: 30}}>
                    {/* add dep and arr buttons here*/}
                </View>
                <View style={{flexDirection: "row", gap: 30}}>
                    <View style={{flexDirection: "column", gap: 10}}>
                        <Pressable onPress={() => getCurrentTime(setDepTime)} style={styles.button}>
                            <Text style={styles.createText}>Get Time</Text>
                        </Pressable>
                        <Text style={styles.time}>Departure Time: {depTime}</Text>
                    </View>
                    <View style={{flexDirection: "column", gap: 10}}>
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
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    fontSize: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
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