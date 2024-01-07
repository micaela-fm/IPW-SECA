# Instructions to Run the Application

## Running the Application

### Setting Up ElasticSearch

1. **Download [ElasticSearch](https://www.elastic.co/pt/downloads/elasticsearch).**
2. **Unzip the Downloaded Directory.**
3. **Start ElasticSearch:**
    - Navigate to the unzipped directory's 'bin' folder.
    - Open there a Command Line interface and run `elasticsearch.bat`.
4. **Configure ElasticSearch:**
    - Close the Command Line after configurations.
    - Go to the 'config' directory.
    - Open 'elasticsearch.yml' in a text editor.
    - Make these changes:
        - Line 92: `xpack.security.enabled: false`
        - Line 94: `xpack.security.enrollment.enabled: false`
        - Lines 97 and 98: 
          ```yaml
          xpack.security.http.ssl:
            enabled: false
          ```
        - Lines 102 and 103:
          ```yaml
          xpack.security.transport.ssl:
            enabled: false
          ```
    - Save and close 'elasticsearch.yml'.
5. **Start ElasticSearch Again:**
    - Open a new Command Line in the 'bin' folder.
    - Run `elasticsearch`.
6. **Verify ElasticSearch:**
    - Open a browser at 'http://localhost:9200/'.
    - If details appear, ElasticSearch is ready.

### Running the Project

7. **Clone the Repository**.
8. **Run these commands in the Terminal:**
    ```bash
    npm install
    node .\seca-server.mjs
    ```
    - Expect to see in the Terminal:
      ```
      Starting server set up
      Ending server set up
      Server listening in http://localhost:3000
      ```
9. **View the SECA Website:**
    - Open a browser tab at 'http://localhost:3000/seca/home.html'.

