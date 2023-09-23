import React, { useState, useEffect } from 'react';
import {
  Image,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  ScrollView,
  Dimensions,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Constants from '../../Constants/Constants';
import Button from '../../Components/Button';
import Loader from '../../Components/Loader';
import ImagePicker from 'react-native-image-crop-picker';
import EditHeader from '../../Components/EditHeader';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import GalleryHeader from '../../Components/GalleryHeader';

const windowWidth = Dimensions.get('window').width;

const CreatePost = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState({});
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const requestCameraRollPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, fetch photos
          fetchPhotos();
        } else {
          console.log('Camera roll permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestCameraRollPermission();
  }, []);

  const fetchPhotos = () => {
    // Define query options for CameraRoll.getPhotos()
    const fetchParams = {
      first: 20, // Number of photos to fetch
      assetType: 'Photos', // Type of assets (Photos or Videos)
    };

    // Fetch photos from the camera roll
    CameraRoll.getPhotos(fetchParams).then((data) => {
      const assets = data.edges.map((item) => item.node.image);
      console.log("assetsassetsassetsassets", assets)
      setPhotos(assets);
    });
  };

    const onChooseImage = (photo) => {
        const photoData = {
          uri: photo.uri,
          // type: photo.assets[0].type,
          name: photo.fileName,
        };
        setThumbnail(photoData);
  };

  const handleNextStepClick = async () => {
    try {
      if (!thumbnail.length) {
        setLoaderVisible(false);
        if (!Object.keys(thumbnail).length) {
          Alert.alert('Please add a thumbnail image');
          return;
        } else {
          const thumbnailPath = thumbnail.uri; // Assuming 'uri' contains the file path
          if (!thumbnailPath) {
            Alert.alert('Thumbnail image path is missing');
            return;
          }

          const image = await ImagePicker.openCropper({
            includeBase64: true,
            path: thumbnailPath, // Use the correct file path
            cropping: false,
            freeStyleCropEnabled: true,
            compressImageQuality: 0.8,
            showCropFrame: true,
            mediaType: 'photo',
          });

          if (image) {
            navigation.navigate('FilterScreen', { imageData: image });
          } else {
            Alert.alert('Image selection failed');
          }
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Alert.alert('An error occurred');
    }
  };

  const chunkArray = (array, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <EditHeader title={"New Post"} onNextClick={handleNextStepClick} />
      <View style={styles.imageView}>
        {Object.keys(thumbnail).length ? (
          <>
            {/* Display the selected image */}
            <View style={styles.insideView}>
              <Image
                source={{ uri: thumbnail?.uri }}
                style={styles.thumbImage}
                resizeMode={'contain'}
              />
            </View>
          </>
        ) : (
          <>
            {/* Display the gallery when no image is selected */}
            <View style={{ ...styles.pickContainer, height: 150 }}>
              <TouchableOpacity
                // onPress={() => setThumbnail({})} /* Remove this line */
                activeOpacity={0.7}>
                <View style={styles.galleryView}>
                  <Image
                    source={require('../../Assests/Pick.png')}
                    style={styles.galleryImg}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.postTextView}>
              <Text style={styles.introText}>
                {Constants.create_post_story}
              </Text>
            </View>
          </>
        )}
      </View>
      <GalleryHeader/>
      <ScrollView>
      
        {chunkArray(photos, 3).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {/* <> */}
            
            {row.map((photo, photoIndex) => (
              
              <TouchableOpacity onPress={() => onChooseImage(photo)}>
              <Image
                key={photoIndex}
                source={{ uri: photo.uri }}
                style={styles.image}
              />
              </TouchableOpacity>
            ))}
            {/* </> */}
          </View>
        ))}
      </ScrollView>
      <Loader titleText={''} visible={loaderVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button_next: {
    textTransform: 'uppercase',
    fontSize: wp('5%'),
    color: 'white',
    marginHorizontal: wp('7%'),
  },
  editView: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: wp('5%'),
    alignSelf: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
  imageView: {
    paddingHorizontal: wp('5%'),
    paddingVertical: wp('10%'),
    backgroundColor: '#FFFFFF',
    marginTop: wp('5%'),
    width: wp('100%'),
  },
  insideView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImage: {
    width: wp('100%'),
    height: wp('80%'),
  },
  editImage: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    tintColor: '#FFFFFF',
  },
  galleryView: {
    height: wp('20%'),
    width: wp('20%'),
    backgroundColor: '#FF701F',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImg: {
    height: wp('7%'),
    width: wp('7%'),
    tintColor: 'white',
  },
  postTextView: {
    marginTop: wp('5%'),
  },
  safeView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonView: {
    marginTop: wp('7%'),
    marginBottom: wp('3%'),
  },
  pickContainer: {
    borderWidth: 1,
    borderColor: '#DFDFDF',
    marginTop: hp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    width: '100%',
    paddingVertical: wp('7%'),
  },
  addLessonBtnContainer: {
    backgroundColor: '#FF701F',
    borderRadius: 4,
    paddingHorizontal: wp('3%'),
    paddingVertical: wp('2%'),
  },
  introText: {
    textTransform: 'uppercase',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#1F1F1F',
    fontSize: wp('5%'),
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 10,
  },
  image: {
    width: (windowWidth - 20) / 3, // Divide by 3 for three images in a row
    height: 100, // Adjust the height as needed
  },
});

export default CreatePost;
