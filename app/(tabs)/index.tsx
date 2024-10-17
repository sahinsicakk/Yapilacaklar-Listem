import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useState, useEffect } from "react";
import Fallback from "@/components/Fallback";
import { IconButton } from "react-native-paper";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Todo {
  id: string;
  title: string;
  category: "Okul" | "Diğer";
}

export default function HomeScreen({ navigation }) {
  const [todo, setTodo] = useState<string>("");
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<Todo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"Okul" | "Diğer">("Diğer");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      const user = userString ? JSON.parse(userString) : null;
      setUsername(user.username);
      loadTodos(user.username);
    };

    getCurrentUser();
  }, []);

  const loadTodos = async (username: string) => {
    const todosString = await AsyncStorage.getItem(`todos_${username}`);
    const todos = todosString ? JSON.parse(todosString) : [];
    setTodoList(todos);
  };

  const handleAddTodo = async () => {
    if (todo.trim() !== "") {
      const newTodo: Todo = {
        id: Date.now().toString(),
        title: todo,
        category: selectedCategory,
      };
      const updatedTodoList = [...todoList, newTodo];
      setTodoList(updatedTodoList);
      setTodo(""); 

      await AsyncStorage.setItem(`todos_${username}`, JSON.stringify(updatedTodoList));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const updatedTodoList = todoList.filter((item) => item.id !== id);
    setTodoList(updatedTodoList);
    await AsyncStorage.setItem(`todos_${username}`, JSON.stringify(updatedTodoList));
  };

  const handleEditTodo = (todo: Todo) => {
    setEditedTodo(todo);
    setTodo(todo.title);
    setSelectedCategory(todo.category);
  };

  const handleUpdateTodo = async () => {
    if (!editedTodo) return;

    const updatedTodos = todoList.map((item) =>
      item.id === editedTodo.id ? { ...item, title: todo, category: selectedCategory } : item
    );
    setTodoList(updatedTodos);
    setEditedTodo(null);
    setTodo("");

    await AsyncStorage.setItem(`todos_${username}`, JSON.stringify(updatedTodos));
  };

  const renderTodos = ({ item }: { item: Todo }) => (
    <View style={[styles.todoItem, item.category === "Okul" && styles.okulCategory]}>
      <View style={styles.todoContent}>
        {item.category === "Okul" && (
          <Image source={require("@/assets/images/graduate.png")} style={styles.logo} />
        )}
        {item.category === "Diğer" && (
          <Image source={require("@/assets/images/others.png")} style={styles.logo} />
        )}
        <Text style={styles.todoText}>{item.title}</Text>
      </View>
      <IconButton icon="pencil" iconColor="#fff" onPress={() => handleEditTodo(item)} />
      <IconButton icon="trash-can" iconColor="#fff" onPress={() => handleDeleteTodo(item.id)} />
    </View>
  );

  const handleLogout = () => {
    // Burada kullanıcı çıkış işlemi yapılabilir (örn. AsyncStorage temizleme)
    navigation.navigate("Login"); // Login sayfasına yönlendirme
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Yapılacak bir şey ekle"
        value={todo}
        onChangeText={setTodo}
      />
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "Okul" && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory("Okul")}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === "Okul" && styles.selectedCategoryText,
            ]}
          >
            Okul
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === "Diğer" && styles.selectedCategoryButton,
          ]}
          onPress={() => setSelectedCategory("Diğer")}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === "Diğer" && styles.selectedCategoryText,
            ]}
          >
            Diğer
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={editedTodo ? handleUpdateTodo : handleAddTodo}
      >
        <Text style={styles.buttonText}>{editedTodo ? "Kaydet" : "Ekle"}</Text>
      </TouchableOpacity>
      <FlatList
        data={todoList}
        renderItem={renderTodos}
        keyExtractor={(item) => item.id}
      />
      {todoList.length <= 0 && <Fallback />}
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    top: 14,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#FFFFEB",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 25,  
    elevation: 10,
  },
  button: {
    top: 5,
    backgroundColor: "#20B2AA",
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,  
    alignItems: "center",
    elevation: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#20B2AA",
    marginVertical: 4,  
    elevation: 5,
  },
  okulCategory: {
    backgroundColor: "#FF6347",
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative", 
  },
  todoText: {
    color: "#fff",
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: "row",
    marginVertical: 8,  
    justifyContent: "space-around",
  },
  categoryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedCategoryButton: {
    backgroundColor: "#20B2AA",
  },
  categoryButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#fff",
  },
  logo: {
    right: 10,
    top: 2,
    width: 25,
    height: 25,
  },
  logoutButton: {
    backgroundColor: "#20B2AA",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
