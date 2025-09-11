import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import DashboardScreen from '../components/DashboardScreen';
import CustomHeader from '../components/CustomHeader';
import Theme from '../assets/theme';

// import { Ionicons } from 'react-native-vector-icons';

const DinneScreen = () => {
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [mealType, setMealType] = useState('Dinner');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [showOutletDropdown, setShowOutletDropdown] = useState(false);

  const outlets = [
    'Hatari (Barisha)',
    'Hatari (Salt Lake)',
    'Hatari (Park Street)',
  ];
  const lunchSlots = ['12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'];
  const dinnerSlots = [
    '6:30 PM',
    '7:00 PM',
    '7:30 PM',
    '8:00 PM',
    '8:30 PM',
    '9:00 PM',
  ];

  useEffect(() => {
    setTimeSlots(dinnerSlots);
  }, []);

  const handleMealType = type => {
    setMealType(type);
    setSelectedTime('');
    setTimeSlots(type === 'Lunch' ? lunchSlots : dinnerSlots);
  };

  const handleProceed = () => {
    if (!selectedOutlet || !selectedTime) {
      alert('Please select all options.');
      return;
    }
    alert(
      `Table booked at ${selectedOutlet}\n${mealType} - ${selectedTime}\nDate: ${date}\nGuests: ${guests}`,
    );
  };

  return (
    <DashboardScreen> 
        <CustomHeader title='Dining'/>
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      {/* 1. Restaurant Image */}

      {/* 2. Outlet Dropdown */}
      <Text style={styles.label}>Please select an outlet</Text>
      <TouchableOpacity
        style={styles.dropdownBtn}
        onPress={() => setShowOutletDropdown(!showOutletDropdown)}>
        <Text style={styles.dropdownText}>
          {selectedOutlet || 'Select Outlet'}
        </Text>
        {/* <Ionicons name={showOutletDropdown ? 'chevron-up' : 'chevron-down'} size={20} /> */}
      </TouchableOpacity>
      {showOutletDropdown && (
        <View style={styles.dropdownList}>
          {outlets.map((outlet, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOutlet(outlet);
                setShowOutletDropdown(false);
              }}>
              <Text style={styles.dropdownItemText}>{outlet}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1',
        }}
        style={styles.restaurantImage}
      />

      {/* 4. Date Picker */}
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity
        style={styles.dateField}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{moment(date).format('YYYY-MM-DD')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={new Date(date)}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate)
              setDate(moment(selectedDate).format('YYYY-MM-DD'));
          }}
        />
      )}

      {/* 3. Meal Type Toggle */}
      <Text style={styles.sectionTitle}>Meal Type</Text>
      <View style={styles.toggleRow}>
        {['Lunch', 'Dinner'].map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.toggleButton,
              mealType === type && styles.activeToggle,
            ]}
            onPress={() => handleMealType(type)}>
            <Text
              style={
                mealType === type ? styles.activeToggleText : styles.toggleText
              }>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 5. Time Slots */}
      <Text style={styles.sectionTitle}>Choose Time Slot</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginBottom: 16}}>
        {timeSlots.map(time => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeSlot,
              selectedTime === time && styles.activeTimeSlot,
            ]}
            onPress={() => setSelectedTime(time)}>
            <Text
              style={
                selectedTime === time ? styles.activeTimeText : styles.timeText
              }>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 6. Guests */}
      <Text style={styles.sectionTitle}>Guests</Text>
      <View style={styles.guestsRow}>
        {[...Array(10)].map((_, i) => (
          <TouchableOpacity
            key={i + 1}
            style={[
              styles.guestButton,
              guests === i + 1 && styles.activeGuestButton,
            ]}
            onPress={() => setGuests(i + 1)}>
            <Text
              style={
                guests === i + 1 ? styles.activeGuestText : styles.guestText
              }>
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 7. Proceed Button */}
      <TouchableOpacity
        style={[
          styles.proceedButton,
          (!selectedOutlet || !selectedTime) && styles.disabledButton,
        ]}
        onPress={handleProceed}
        disabled={!selectedOutlet || !selectedTime}>
        <Text style={styles.proceedText}>Book Table</Text>
      </TouchableOpacity>
    </ScrollView>
    </DashboardScreen>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff',marginTop:10},
  label: {fontSize: 14, marginBottom: 8, color: Theme.colors.red, fontWeight: '500'},
  restaurantImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  dropdownBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  dropdownText: {fontSize: 16, color: '#444'},
  dropdownList: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {fontSize: 16, color: '#444'},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginVertical: 10, color:Theme.colors.red},
  toggleRow: {flexDirection: 'row', marginBottom: 16},
  toggleButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeToggle: {backgroundColor: '#e63946', borderColor: '#e63946'},
  toggleText: {color: '#444', fontWeight: '500'},
  activeToggleText: {color: '#fff', fontWeight: '600'},
  dateField: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  dateText: {fontSize: 14, color: '#000'},
  timeSlot: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  activeTimeSlot: {backgroundColor: '#e63946', borderColor: '#e63946'},
  timeText: {color: '#444'},
  activeTimeText: {color: '#fff', fontWeight: '600'},
  guestsRow: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20},
  guestButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  activeGuestButton: {backgroundColor: '#e63946', borderColor: '#e63946'},
  guestText: {color: '#444'},
  activeGuestText: {color: '#fff', fontWeight: '600'},
  proceedButton: {
    backgroundColor: '#e63946',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {backgroundColor: '#ccc'},
  proceedText: {color: '#fff', fontWeight: '600', fontSize: 16},
});

export default DinneScreen;
