import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/ui/icon-button';
import { Symbols } from '@/components/ui/symbol-icon';
import { defaultViewOptions, type ViewOptions } from '@/wishlist/view-options';
import { WishList } from '@/wishlist/wish-list';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [viewOptions, setViewOptions] = useState<ViewOptions>(defaultViewOptions);
  const [createOpen, setCreateOpen] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          accessibilityLabel="Add wish"
          icon={Symbols.add}
          onPress={() => setCreateOpen(true)}
          style={styles.headerButton}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <WishList
        createOpen={createOpen}
        onCreateOpenChange={setCreateOpen}
        onViewOptionsChange={setViewOptions}
        viewOptions={viewOptions}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    marginRight: 4,
  },
});
