import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../store/slices/productSlice';
import { RootState } from '../../store/store';
import ProductCard from '../../components/products/ProductCard';

const ProductListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { items, isLoading, error } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007b5e" style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No products found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    margin: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  empty: {
    color: '#555',
    margin: 24,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProductListScreen;
