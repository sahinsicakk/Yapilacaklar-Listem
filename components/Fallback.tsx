import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const Fallback = () => {
    return (
        <View style={{alignItems:"center"}}>
            <Image
                source={require("../assets/images/Y.png")} 
                style={{ height: 400, width: 400,top:-90 }}
            />

            <Text style={styles.TXT}>Haydi Yapılacak Bir Şey Ekle!</Text>
        </View>
    );
}

export default Fallback;

const styles = StyleSheet.create({

    TXT:{
        fontStyle:'italic',
        fontSize:20,
        top:-90,
        color:'#999',
        fontWeight: "bold"
        
    }
});
