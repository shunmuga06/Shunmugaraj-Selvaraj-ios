import React, { useRef, useState, useEffect } from 'react';
import { View, SafeAreaView,Alert,
    TextInput, Pressable, FlatList, 
    Text, Image, StyleSheet,
    ActivityIndicator,StatusBar } from 'react-native';

export default function Index() {

  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  // Track the current page
  const [page, setPage] = useState(1);
  // Track the total number of results
  const [totalCount, setTotalCount] = useState(0); 
  const userNameRef = useRef(null);

  const handleSubmit = () => {
      // Reset page to 1 on new search
      setPage(1);
      fetchUsers();
  }

  // Handle load more when the user scrolls to the bottom
  const handleLoadMore = () => {
      // Prevent unnecessary API calls
      if (isLoading || userData.length >= totalCount) return; 
      // Increment page number to load next set of data
      setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
      if (page > 1) {
        // Fetch new data when page is incremented
        fetchUsers(); 
      }
  }, [page]);

  const fetchUsers = async () => {

      const textInputValue = userNameRef.current?.value;
      
      if (textInputValue === "") {
        return // Don't fetch if input is empty or only whitespace
      }
      setLoading(true);

      try {
          const response = await fetch(
            `https://api.github.com/search/users?q=${textInputValue}&page=${page}&per_page=10`
          );
          const data = await response.json();
          setTotalCount(data.total_count); // Save total results count for pagination
          if (page === 1) {
            setUserData(data.items); // Reset user data when starting a new search
          } else {
            setUserData((prevData) => [...prevData, ...data.items]); // Append new items for pagination
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
  };

  const renderItem = ({ item }) => {
        return (
            <View style={styles.resultItem}>
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                <Text style={styles.text}>{item.login}</Text>
                <Text style={styles.text}>{item.type}</Text>
            </View>
        );
  };

  return (
    <SafeAreaView style={styles.container}>
        <View >
            <TextInput
            ref={userNameRef}
            style={styles.input}
            placeholder="Search for GitHub users"
            />
        </View>
        <Pressable style={styles.buttonStyle} activeOpacity={0.5} onPress={handleSubmit}>
            <Text style={styles.buttonTextStyle}>Submit</Text>
        </Pressable>
        {isLoading && <ActivityIndicator size="large" color="#C15838" style={styles.loader} />}
        <FlatList
            data={userData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={isLoading && <ActivityIndicator size="small" color="#C15838" />}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: '#F8F7F3',
        margin:20
    },
    input: {
        margin:10,
        height:40,
        color: 'gray',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 7,
        borderColor : "#F8894F",
    },
    buttonStyle : {
        backgroundColor : "#C15838",
        height : 45,
        borderColor : "gray",
        borderWidth  : 1,
        borderRadius : 5,
        alignItems : "center",
        justifyContent : "center"
      },
      buttonTextStyle : {
        color : "white"  ,
        fontSize: 18,
        fontWeight : "bold"
      },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomColor: '#C15838',
      borderBottomWidth: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
      borderColor : "#C15838",
      borderWidth  : 1,
    },
    text: {
      marginLeft: 10,
      flex: 1,
    },
    loader: {
      marginVertical: 20,
    },
  });