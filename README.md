# Pre-Requisites
1. Node >=6.x

#Setup Instructions

1. git clone https://github.com/sandeepsunia/React-Admin-for-App.git
2. cd React-Admin-for-App
3. git checkout master
4. npm install -g yarn
5. yarn
6. if PhantomJs error comes then
7. npm install
8. yarn run dev
9. if node-sass error comes
10. npm rebuild node-sass
11. yarn run dev
12. Need backend for Data Apis
Format for CSV upload:
1. Fields in the csv should be in fixed order.
2. Csv should include header (first line with field names as below).
3. Order - email,name,affiliation,title,contact,speaker,bio,picture,password
4. Default password for all users is 'nystar2017' in case password column is
   not provided or is empty for a user in csv.
