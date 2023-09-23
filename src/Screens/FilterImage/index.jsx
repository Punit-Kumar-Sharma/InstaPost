import React, { useRef, useState, useEffect } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import { FILTERS } from '../../Helpers/Filters';
import Button from '../../Components/Button';
import Constants from '../../Constants/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EditHeader from '../../Components/EditHeader';

const FilterScreen = ({ navigation, route }) => {

  const [selectedFilterIndex, setIndex] = useState(0);
  const [image, SetImage] = useState('')
  const [thumbnail, setThumbnail] = useState({});

  useEffect(() => {
    getImageFromNavigation()
    console.log("imageData",route?.params?.imageData)
  })

  const getImageFromNavigation = () => {
    if (route?.params?.imageData) {
      setThumbnail(route?.params?.imageData)
    }
  }

  const onExtractImage = ({ nativeEvent }) => {
    SetImage(nativeEvent.uri)
    extractedUri.current = nativeEvent.uri;
  };

  const onSelectFilter = selectedIndex => {
    setIndex(selectedIndex);
  };

  const extractedUri = useRef(thumbnail?.path);

  const handleNextStepClick = async () => {
    try {
      let imagePath;
      console.log("imagePath",thumbnail?.path)
      if (selectedFilterIndex === 0) {
        imagePath = thumbnail?.path;
      } else {
        imagePath = image;
      }
  
      if (!imagePath || typeof imagePath !== 'string') {
        // Ensure imagePath is a valid string file path
        console.log('Invalid image path');
        return;
      }
  
      navigation.navigate('ViewImage', { imageString: imagePath });
    } catch (error) {
      console.error('An error occurred:', error);
      // Alert.alert('An error occurred');
    }
  };
  


  const renderFilterComponent = ({ item, index }) => {
    const FilterComponent = item.filterComponent;
    const image = (
      <Image
        style={styles.filterSelector}
        source={{ uri: thumbnail?.path }}
        defaultSource={require('../../Assests/Pick.png')}
      />
    );
    return (
      <TouchableOpacity onPress={() => onSelectFilter(index)}>
        <Text style={styles.filterTitle}>{item.title}</Text>
        <FilterComponent image={image} />
      </TouchableOpacity>
    );
  };

  const SelectedFilterComponent = FILTERS[selectedFilterIndex].filterComponent;

  return (
    <>
      <SafeAreaView
        style={styles.safeView}>
        <EditHeader title={"Filters"} onNextClick={handleNextStepClick} />
        <ImageBackground
          source={require('../../Assests/image_background.png')}
          style={styles.container}>

          <KeyboardAwareScrollView
            contentContainerStyle={styles.keyboardContainer}
            resetScrollToCoords={{ x: 0, y: 0 }}>

            {selectedFilterIndex === 0 ? (
              <Image
                style={styles.default_Img}
                source={{ uri: thumbnail?.path }}
                resizeMode='contain'
              />
            ) : Object.keys(thumbnail).length && (
              <SelectedFilterComponent
                onExtractImage={onExtractImage}
                extractImageEnabled={true}
                image={
                  <Image
                    style={styles.default_Img}
                    source={{ uri: thumbnail?.path }}
                    resizeMode='contain'
                  />
                }
              />
            )}
            <FlatList
              data={FILTERS}
              keyExtractor={item => item.title}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={renderFilterComponent}
            />
            {/* <View style={styles.buttonView}>
              <Button
                title={Constants.next}
                onclick={handleNextStepClick}
                style={{ textTransform: 'uppercase' }}
              />
            </View> */}
          </KeyboardAwareScrollView>
        </ImageBackground>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  default_Img: {
    flex: 1,
    width: wp('100%'),
    height: hp('50%'),
    alignSelf: 'center',
    alignContent: 'center'
  },
  keyboardContainer: {
    width: wp('90%'),
  },
  buttonView: {
    marginTop: wp('7%'),
    marginBottom: wp('3%')
  },
  safeView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterSelector: {
    width: 100,
    height: 100,
    margin: 5,
  },
  filterTitle: {
    marginTop: 70,
    fontSize: 12,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginTop:10
  },
});
export default FilterScreen;
