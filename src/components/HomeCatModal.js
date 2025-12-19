// HomeCatModal.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../redux/slice/GetAllCategorySlice';
import { useNavigation } from '@react-navigation/native';

const HomeCatModal = ({
  visible,
  onClose,
  title = 'What Are You Craving?',
  cuisineType,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isVeg = useSelector(state => state.foodFilter.isVeg);
  const categoriesState = useSelector(state => state.categoriesAllcat);

  const categoriesData = categoriesState?.categories?.categories || [];

  useEffect(() => {
    if (visible && cuisineType?._id) {
      dispatch(
        fetchAllCategories({
          mainCategory: cuisineType._id,
          type: isVeg ? 'veg' : 'non-veg',
        })
      );
    }
  }, [visible, cuisineType, isVeg]);

  const filteredCategories = categoriesData.filter(item => {
    if (!item?.type) return !isVeg;

    const types = Array.isArray(item.type)
      ? item.type.map(t => t.toLowerCase())
      : [String(item.type).toLowerCase()];

    return isVeg ? types.includes('veg') : !types.includes('veg');
  });

  const handleCategoryClick = item => {
    navigation.navigate('CuisineTypeSubCat', {
      id: item?._id,
      cuisineType,
    });
    onClose?.();
  };

  const capitalizeFirstWord = text => {
    if (!text) return '';
    const str = String(text);
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <View style={styles.container}>
          {/* HEADER */}
          <LinearGradient colors={['#ff3b3b', '#ffc9c9']} style={styles.header}>
            <Text style={styles.headerTitle}>
              {capitalizeFirstWord(cuisineType?.name)}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* CATEGORY GRID */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 25 }}
          >
            <View style={styles.grid}>
              {categoriesState.loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <View key={i} style={styles.loadingCard} />
                  ))
                : filteredCategories.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      activeOpacity={0.8}
                      onPress={() => handleCategoryClick(item)}
                    >
                      <LinearGradient
                        colors={['#ffecec', '#fff0f0']}
                        style={styles.categoryCircle}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.foodImage}
                        />
                      </LinearGradient>

                      <Text style={styles.name} numberOfLines={1}>
                        {item?.name
                          ?.replace(/\s*\(veg\)/gi, '')
                          ?.replace(/\s*\(nonveg\)/gi, '')
                          ?.replace(/\s*\(non-veg\)/gi, '')
                          ?.replace(/\bveg\b/gi, '')
                          ?.replace(/\bnonveg\b/gi, '')
                          ?.replace(/\bnon-veg\b/gi, '')
                          ?.replace(/[()]/g, '')
                          ?.trim()}
                      </Text>
                    </TouchableOpacity>
                  ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HomeCatModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  backdrop: { flex: 1 },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '83%',
    elevation: 15,
  },
  header: {
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  closeText: { fontSize: 24, color: '#fff', fontWeight: '700' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  loadingCard: {
    width: '48%',
    height: 120,
    borderRadius: 48,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
    elevation: 3,
  },
  card: {
    width: '48%', // 2 items side by side
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  categoryCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  foodImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});
