import { View } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarLabelStyle: { color: "black", fontSize: 14 },
            headerShown: false,
            tabBarStyle: { 
                paddingTop: 5, 
                paddingBottom: 10,
                height: 80, 
                backgroundColor: "white", 
                elevation: 0, 
                shadowOpacity: 0, 
                borderTopWidth: 0, 
            },
            backgroundColor: "white",
            tabBarIconStyle: {
                justifyContent: "center",
                alignItems: "center",
            },
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 60,
                            width: 60,
                        }}>
                            <FontAwesome5 name="home" size={40} color={focused ? "red" : "black"} />
                        </View>
                    )
                }}
            ></Tabs.Screen>
            <Tabs.Screen
                name="create"
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 60,
                            width: 60,
                        }}>
                            <FontAwesome5 name="plus" size={40} color={focused ? "red" : "black"} />
                        </View>
                    )
                }}
            ></Tabs.Screen>
        </Tabs>
    )
}