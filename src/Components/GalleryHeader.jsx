import React from 'react';
import { View, Text, TouchableOpacity, Image,StatusBar } from 'react-native';

const GalleryHeader = ({}) => {

  return (
    <View style={styles.headerContainer}>
      <View style={{height:36}}>
        {/* <TouchableOpacity>
        <Image
            style={{ width: 25, height: 25 }}
            source={require('../Assests/Cross.png')}
          />
        </TouchableOpacity> */}
      <Text style={styles.appTitleMain}>{"Gallery Images"}</Text>
      </View>
      {/* <View>
      <TouchableOpacity onPress={onNextClick}>
      <Text style={{...styles.appTitleMain, color: '#1D7BBF'}}>{"Next"}</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = {
  headerContainer: {
    marginTop: StatusBar.currentHeight,
    marginLeft:10,
    width:"100%",
    height:36
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
    marginLeft:10,
  },
};

export default GalleryHeader;
