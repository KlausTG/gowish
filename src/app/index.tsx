import { useNavigation } from "expo-router";
import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Fab } from "@/components/ui/fab";
import { IconButton } from "@/components/ui/icon-button";
import { Symbols } from "@/components/ui/symbol-icon";
import { Spacing } from "@/constants/theme";
import { defaultViewOptions, type ViewOptions } from "@/wishlist/view-options";
import { WishList } from "@/wishlist/wish-list";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [viewOptions, setViewOptions] =
    useState<ViewOptions>(defaultViewOptions);
  const [createOpen, setCreateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filterActive = viewOptions.onlyUnreserved;
  const sortActive = viewOptions.sortOrder !== "default";

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          <IconButton
            accessibilityLabel="Filter list"
            active={filterActive}
            icon={Symbols.filter}
            onPress={() => setFilterOpen(true)}
            showActiveDot={filterActive}
          />
          <IconButton
            accessibilityLabel="Sort list"
            active={sortActive}
            icon={Symbols.sort}
            onPress={() => setSortOpen(true)}
            showActiveDot={sortActive}
          />
        </View>
      ),
    });
  }, [filterActive, navigation, sortActive]);

  return (
    <View style={styles.container}>
      <WishList
        createOpen={createOpen}
        filterOpen={filterOpen}
        onCreateOpenChange={setCreateOpen}
        onFilterOpenChange={setFilterOpen}
        onSortOpenChange={setSortOpen}
        onViewOptionsChange={setViewOptions}
        sortOpen={sortOpen}
        viewOptions={viewOptions}
      />
      <Fab
        accessibilityLabel="Add wish"
        icon={Symbols.add}
        onPress={() => setCreateOpen(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginRight: Spacing.one,
  },
});
