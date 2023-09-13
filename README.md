# Parkhub

Run: nodemon ./bin/www 
On browser: 
 - http://localhost:3000/
 - http://localhost:3000/lots/:zipcode


###### Project layout:
1. app.js - has routes references
2. .env - contains credentials to connect to MongoDB and contains key to connect to MapQuest
3. config.js - returns connection to MapQuest
4. /dbs - contains DB schemas for Lot, Meter, and MeterZipCode
5. /routes - api.js will get the data asked in the assignment. index.js will generate the mongo collections
6. /services - data_processor.js handels all the data to be processed and returned. 

###### How I got the zip codes for the meters:
I decided to use MapQuest. It does come with some extra information, so I had to make additinal steps to get the zip code.
First, I got the meters' latitude and longitude and stored it in pairs in an list of lists. Next, I used axios to get the request. To get to the zip code, I accessed the data in 'results' and then in 'locations'. The zip code returned was a string and it sometimes was the full zipcode. Therefore, I sliced the string and casted it to Number to store it in the MeterZipCode collection. I decided it was best to create this collection to store active status, the zip code, the addres, and the ID.

###### How to get the total amount of available meters and parking paces:
I simply returned a query which only looked at the data given a zip code and counted the number of instances
