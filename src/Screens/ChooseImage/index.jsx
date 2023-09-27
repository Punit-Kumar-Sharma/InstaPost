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

const windowWidth = Dimensions.get('window').width;
const windowheight = Dimensions.get('window').height;

const CreatePost = ({ navigation }) => {
  const [thumbnail, setThumbnail] = useState({});
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState("Post");

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
      setPhotos(assets);
      const photoData1 = {
        uri: assets[0].uri,
        // type: assets.assets[0].type,
        name: assets[0].filename,
      };
      setThumbnail(photoData1);
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
      <EditHeader title={"New Post"} onNextClick={handleNextStepClick}/>
      <View style={styles.imageView}>
              <Image
                source={{ uri: thumbnail?.uri }}
                style={styles.thumbImage}
                resizeMode={'contain'}
              />
      </View>
      <Text style={styles.GalleryHeader}>{"Gallery Images"}</Text>
      <ScrollView>
      
        {chunkArray(photos, 4).map((row, rowIndex) => (
          <View key={rowIndex} style={styles.galleryImagesWrapper}>
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
      <View style={styles.footer}>
        <TouchableOpacity onPress={()=>setPage("Post")} style={[page==="Post" ?styles.pickedFooterSection:styles.footerSection]}>
          <Text style={[page==="Post" ?styles.pickedFooterTitle:styles.footerTitle]}>Post</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setPage("Story")} style={[page==="Story" ?styles.pickedFooterSection:styles.footerSection]}>
          <Text style={[page==="Story" ?styles.pickedFooterTitle:styles.footerTitle]}>Story</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>setPage("Reel")} style={[page==="Reel" ?styles.pickedFooterSection:styles.footerSection]}>
          <Text style={[page==="Reel" ?styles.pickedFooterTitle:styles.footerTitle]}>Reel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageView: {
    // paddingHorizontal: wp('5%'),
    // paddingVertical: wp('5%'),
    marginTop:wp('5%'),
    backgroundColor: '#FFFFFF',
    width: wp('100%'),
    elevation:0.5
  },
  thumbImage: {
    width: wp('100%'),
    height: wp('80%'),
    backgroundColor: '#000',
  },
  safeView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  GalleryHeader: {
    color: '#000',
    fontSize: 19,
    fontWeight: "600",
    marginLeft:10,
    paddingVertical:10,
    elevation:0.5
  },
  image: {
    width: windowWidth / 4,
    height: windowheight / 6,
    padding: 1,
  },
  galleryImagesWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"space-evenly"
  },
  footerSection: {
    // flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  pickedFooterSection: {
    padding: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  pickedFooterTitle: {
    fontSize: 16,
    color: 'black',
  },
  footerTitle: {
    fontSize: 16,
    color: 'gray',
  },
});

export default CreatePost;
