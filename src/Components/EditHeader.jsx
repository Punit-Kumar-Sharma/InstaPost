import React from 'react';
import { View, Text, TouchableOpacity, Image,StatusBar } from 'react-native';

const EditHeader = ({title, onNextClick,onStickersClick}) => {

  return (
    <View style={styles.headerContainer}>
      <View style={{flexDirection:"row",height:36,justifyContent:"center",alignItems:"center"}}>
        <TouchableOpacity>
        <Image
            style={{ width: 25, height: 25 }}
            source={require('../Assests/Cross.png')}
          />
        </TouchableOpacity>
      <Text style={styles.appTitleMain}>{title}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
      <TouchableOpacity onPress={onNextClick}>
        <Text style={{...styles.appTitleMain, color: '#1D7BBF'}}>{"Next"}</Text>
      </TouchableOpacity>
      {title==="Filters"&& 
      <TouchableOpacity onPress={onStickersClick}>
        <Text style={{...styles.appTitleMain, color: '#1D7BBF'}}>{"Stickers"}</Text>
      </TouchableOpacity>}
      </View>
    </View>
  );
};

const styles = {
  headerContainer: {
    marginTop: StatusBar.currentHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 7,
    width:"100%",
    height:36
    // backgroundColor: '#007acc', // Customize the background color
  },
  appTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 400,
  },
  appTitleMain: {
    color: '#000',
    fontSize: 19,
    fontWeight: "600",
    marginLeft:20,
  },
};

export default EditHeader;
