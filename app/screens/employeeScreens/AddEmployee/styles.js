import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  joinDateContainer: {
    marginVertical: 8,
    paddingRight: 10
  },
  datePickerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 12
  },
  dateValueContainer: {
    marginRight: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,.1)'
  },
  ratingContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: 8,
    paddingRight: 13
  },
  ratingSliderContainer: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginBottom: 30
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2
  },
  sliderThumb: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: 'white',
    borderColor: '#30a935',
    borderWidth: 2
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginLeft: 25
  },
  image: {
    alignSelf: 'center',
    height: 128,
    width: 128,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#b2b2b2'
  }
});
