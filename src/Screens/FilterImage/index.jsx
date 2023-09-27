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
  Dimensions,
  Modal
} from 'react-native';
import { FILTERS } from '../../Helpers/Filters';
import Button from '../../Components/Button';
import Constants from '../../Constants/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EditHeader from '../../Components/EditHeader';
import StickersComponent from '../../Components/StickersComponent';
import Draggable from 'react-native-draggable';

const windowWidth = Dimensions.get('window').width;

const FilterScreen = ({ navigation, route }) => {
  const [selectedFilterIndex, setIndex] = useState(0);
  const [image, SetImage] = useState('');
  const [thumbnail, setThumbnail] = useState({});
  const [showStickers, setShowStickers] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [stickers, setStickers] = useState([]);
  const [stickerPositions, setStickerPositions] = useState([]); // Added state for sticker positions

  const openModal = () => {
    setShowStickers(!showStickers);
  };
  useEffect(() => {
    getImageFromNavigation()
  }, []); // Added empty dependency array to useEffect

  const getImageFromNavigation = () => {
    if (route?.params?.imageData) {
      setThumbnail(route?.params?.imageData)
    }
  }

  const onExtractImage = ({ nativeEvent }) => {
    SetImage(nativeEvent.uri);
  };

  const onSelectFilter = selectedIndex => {
    setIndex(selectedIndex);
  };

  const handleNextStepClick = async () => {
    try {
      let imagePath;
      if (selectedFilterIndex === 0) {
        imagePath = thumbnail?.path;
      } else {
        imagePath = image;
      }

      if (!imagePath || typeof imagePath !== 'string') {
        console.log('Invalid image path');
        return;
      }

      navigation.navigate('ViewImage', { imageString: imagePath });
    } catch (error) {
      console.error('An error occurred:', error);
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
  const handleStickersClick = () => {
    setShowStickers(true);
  };

  const handleStickerDrag = (index, event, gestureState) => {
    const updatedStickerPositions = [...stickerPositions];
    updatedStickerPositions[index] = {
      x: gestureState.moveX,
      y: gestureState.moveY,
    };
    setStickerPositions(updatedStickerPositions);
  };

  return (
    <>
      <SafeAreaView style={styles.safeView}>
        <EditHeader title={"Filters"} onNextClick={handleNextStepClick} onStickersClick={handleStickersClick}/>
        <ImageBackground
          source={require('../../Assests/image_background.png')}
          style={styles.container}>

          <KeyboardAwareScrollView
            contentContainerStyle={styles.keyboardContainer}
            resetScrollToCoords={{ x: 0, y: 0 }}>
            
            {selectedFilterIndex === 0 ? (
              <View style={styles.canvas}>
                <Image
                  style={styles.default_Img}
                  source={{ uri: thumbnail?.path }}
                  resizeMode='contain'
                />
                  {/* <View style={styles.canvas}> */}
                  {stickers?.map((sticker, index) => (
                    <Draggable
                      key={index}
                      x={sticker.position?.x}
                      y={sticker.position?.y}
                      renderSize={80}
                      isCircle
                      renderText={`Sticker ${index + 1}`}
                      // onDrag={(event, gestureState) => handleStickerDrag(index, event, gestureState)}
                      onDrag={(event, gesture) => {
                        // Update sticker position on drag
                        const newStickers = [...stickers];
                        newStickers[index].position.x = gesture?.moveX;
                        newStickers[index].position.y = gesture?.moveY;
                        setStickers(newStickers);
                      }}
                    >
                      <Image
                        source={{ uri: sticker?.uri }}
                        style={styles.stickerImage}
                      />
                    </Draggable>
                  ))}
                </View>
              // </View>
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
            <Text style={styles.GalleryHeader}>{"Filters"}</Text>
            <FlatList
              data={FILTERS}
              keyExtractor={item => item.title}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              renderItem={renderFilterComponent}
            />
          </KeyboardAwareScrollView>
        </ImageBackground>
        <Modal
          animationType="slide"
          transparent={false}
          visible={showStickers}
          onRequestClose={openModal}
          style={{ height: "50%", backgroundColor: "#000" }}
        >
          <StickersComponent style={{ maxHeight: "50%" }} onStickerSelection={setStickers} onClose={openModal} />
        </Modal>
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
    alignContent: 'center',
    backgroundColor:"#000"
  },
  GalleryHeader: {
    marginTop: 20,
    color: '#000',
    fontSize: 19,
    fontWeight: "600",
    marginLeft:10,
    paddingVertical:10
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
    // marginTop: 70,
    fontSize: 14,
    color:"#000",
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginTop:10
  },
  stickersContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  stickerPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  stickerThumbnail: {
    width: (windowWidth - 20) / 4, // Show 4 stickers per row, adjust as needed
    height: 80, // Adjust the height as needed
    marginBottom: 10,
  },
  canvas: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'white',
  },
  stickerImage: {
    width: 80, // Adjust the size as needed
    height: 80, // Adjust the size as needed
  },
});
export default FilterScreen;
