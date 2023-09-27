import React, { useEffect, useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions,Text } from 'react-native';
import Draggable from 'react-native-draggable';

const windowWidth = Dimensions.get('window').width;

const StickersComponent = ({ onStickerSelection,onClose }) => {
  const [stickers, setStickers] = useState([]);

  const stickerImages = [
    // require('../Assests/Stickers/sticker1.png'),
    // require('../Assests/Stickers/sticker2.png'),
    // require('../Assests/Stickers/sticker3.png'),
    // // Add more sticker images here
    Image.resolveAssetSource(require('../Assests/Stickers/sticker1.png')).uri,
    Image.resolveAssetSource(require('../Assests/Stickers/sticker2.png')).uri,
    Image.resolveAssetSource(require('../Assests/Stickers/sticker3.png')).uri,
    // Add more sticker images here
  ];

  const handleStickerPress = (stickerImage) => {
    const newStickers = [...stickers];
    newStickers.push({
      uri: stickerImage,
      x: 0, // Initial position
      y: 0,
    });
    setStickers(newStickers);
    onStickerSelection(newStickers)
    onClose();
    
  };
// console.log("stickerImages",stickerImages)
  return (
    <View style={styles.stickersContainer}>
      <View style={styles.stickerPicker}>
        {stickerImages?.map((stickerImage, index) => (
            <>
            {/* {console.log("stickerImage.uri",stickerImage)} */}
          <TouchableOpacity
            key={index}
            onPress={() => handleStickerPress(stickerImage)}
          >
           <Image
              key={index}
              source={{ uri: stickerImage }}
              style={styles.stickerThumbnail}
            />
          </TouchableOpacity>
          </>
        ))}
        <TouchableOpacity
            onPress={onClose}
          >
           <Text>
            close
           </Text>
          </TouchableOpacity>
      </View>
      <View style={styles.canvas}>
        {stickers.map((sticker, index) => (
          <Draggable
            key={index}
            x={sticker.x}
            y={sticker.y}
            renderSize={80} // Adjust the size as needed
            isCircle
            renderText={`Sticker ${index + 1}`}
          >
            <Image
              source={{ uri: sticker?.uri }}
              style={styles.stickerImage}
            />
          </Draggable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stickersContainer: {
    // flex: 1,
    height:"50%",
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  stickerImage: {
    width: 80, // Adjust the size as needed
    height: 80, // Adjust the size as needed
  },
});

export default StickersComponent;
