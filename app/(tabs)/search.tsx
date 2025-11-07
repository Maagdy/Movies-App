import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import fetchMovies from "../services/api";
import { updateSearchCount } from "../services/appwrite";
import useFetch from "../services/useFetch";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
    refetch: refetchMovies,
    reset,
  } = useFetch(
    () =>
      fetchMovies({
        query: searchTerm,
      }),
    false
  );

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        await refetchMovies();
      } else {
        reset();
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (movies?.[0] && movies?.length > 0)
      updateSearchCount(searchTerm, movies[0]);
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10 mt-5"></Image>
            </View>
            <View className="my-5">
              <SearchBar
                placeholder="Search Movies ..."
                value={searchTerm}
                onChangeText={(text: string) => setSearchTerm(text)}
              />
            </View>
            {moviesLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3 self-center"
              />
            )}
            {moviesError && (
              <Text className="text-red-500 my-3 px-5 self-center">
                Error: {moviesError.message}
              </Text>
            )}
            {!moviesLoading &&
              !moviesError &&
              "SEARCH TERM".trim() &&
              movies?.length > 0 && (
                <Text className="text-xl text-white font-bold mb-3">
                  Search Results for{" "}
                  <Text className="text-accent">{searchTerm}</Text>
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !moviesLoading && !moviesError ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchTerm.trim() === ""
                  ? "Start typing to search for movies."
                  : "No results found."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({});
