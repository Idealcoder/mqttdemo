package main
import "net/http"
import "os"
import "fmt"

func main() {
    fmt.Println("HTTP Server running on port 8080")
    panic(http.ListenAndServe(":8080", http.FileServer(http.Dir(os.Getenv("SNAP")+"/www"))))
}
