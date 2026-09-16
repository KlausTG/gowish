import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Spacing } from "@/constants/theme";
import {
  validatePriceInput,
  validateTitle,
  validateUrl,
} from "@/utils/validate";
import { useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useAddWish, type AddWishInput } from "./use-add-wish";

type CreateWishFormProps = {
  onSuccess: () => void;
};

export function CreateWishForm({ onSuccess }: CreateWishFormProps) {
  const addWish = useAddWish();
  const titleRef = useRef<TextInput>(null);
  const priceRef = useRef<TextInput>(null);
  const urlRef = useRef<TextInput>(null);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [url, setUrl] = useState("");
  const [titleError, setTitleError] = useState<string>();
  const [priceError, setPriceError] = useState<string>();
  const [urlError, setUrlError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  const titleHint =
    title.length > 60 ? `${title.length}/75 characters` : undefined;

  const canSubmit = useMemo(() => {
    const titleResult = validateTitle(title);
    const priceResult = validatePriceInput(price);
    const urlResult = validateUrl(url);
    return titleResult.ok && priceResult.ok && urlResult.ok;
  }, [title, price, url]);

  const submit = () => {
    setSubmitted(true);
    const titleResult = validateTitle(title);
    const priceResult = validatePriceInput(price);
    const urlResult = validateUrl(url);

    setTitleError(titleResult.ok ? undefined : titleResult.error);
    setPriceError(priceResult.ok ? undefined : priceResult.error);
    setUrlError(urlResult.ok ? undefined : urlResult.error);

    if (!titleResult.ok || !priceResult.ok || !urlResult.ok) return;

    const payload: AddWishInput = {
      title: titleResult.value,
      priceMinor: priceResult.value,
      url: urlResult.value,
    };

    onSuccess();
    addWish.mutate(payload);
    setTitle("");
    setPrice("");
    setUrl("");
    setTitleError(undefined);
    setPriceError(undefined);
    setUrlError(undefined);
    setSubmitted(false);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.form}
    >
      <TextField
        ref={titleRef}
        autoCapitalize="sentences"
        autoFocus
        error={submitted ? titleError : undefined}
        hint={titleHint}
        label="Title"
        maxLength={75}
        onBlur={() => {
          const result = validateTitle(title);
          setTitleError(result.ok ? undefined : result.error);
        }}
        onChangeText={setTitle}
        onSubmitEditing={() => priceRef.current?.focus()}
        returnKeyType="next"
        submitBehavior="submit"
        value={title}
      />
      <TextField
        ref={priceRef}
        error={submitted ? priceError : undefined}
        hint="Amount in DKK (e.g. 449 or 449,50)"
        inputMode="decimal"
        keyboardType="decimal-pad"
        label="Price"
        onBlur={() => {
          const result = validatePriceInput(price);
          setPriceError(result.ok ? undefined : result.error);
        }}
        onChangeText={setPrice}
        onSubmitEditing={() => urlRef.current?.focus()}
        returnKeyType="next"
        submitBehavior="submit"
        value={price}
      />
      <TextField
        ref={urlRef}
        autoCapitalize="none"
        autoCorrect={false}
        error={submitted ? urlError : undefined}
        hint="Optional product link"
        keyboardType="url"
        label="URL"
        onBlur={() => {
          const result = validateUrl(url);
          setUrlError(result.ok ? undefined : result.error);
        }}
        onChangeText={setUrl}
        onSubmitEditing={submit}
        returnKeyType="done"
        textContentType="URL"
        value={url}
      />
      <View style={styles.actions}>
        <Button
          disabled={!canSubmit || addWish.isPending}
          label="Add wish"
          loading={addWish.isPending}
          onPress={submit}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  actions: {
    marginTop: Spacing.one,
  },
});
