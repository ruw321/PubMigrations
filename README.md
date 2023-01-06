# PubMigrations

## Purpose

A major issue faced by all developing economies is the emigration of their most educated population. This is known as a brain drain and it often limits the growth of developing countries. This can be seen in our datasets, as we see accomplished researchers migrating and taking advantage of the new opportunities presented in their new nations. We want to visualize the patterns of medical researcher migration, the countries they migrate to/from, and what countries win/lose on potential research as a result of these migration movements.

## Instructions to run the web application

1) Navigate to the backend folder.
2) Run `npm install`.
3) Run `npm start`. The terminal should show `Server running at http://localhost:8080/
`.
4) Open another terminal and navigate to frontend folder.
5) Run `npm install --force`.
6) Run `npm start`.
7) The application should open automatically at http://localhost:3000/

## Website Demo
https://user-images.githubusercontent.com/54829988/210924301-009bc4c2-c2f6-4cb6-931c-a8c5fa2f2606.mp4



## Data Sources
1) [Pubmed Knowledge Graph Dataset](https://www.kaggle.com/datasets/krishnakumarkk/pubmed-knowledge-graph-dataset)
- This dataset contains PubMed Authors and information about their employment and education history, published papers, and whether they mentioned certain bio entities in the paper abstract.
2) [Scientific Researcher Migrations](https://www.kaggle.com/datasets/jboysen/scientist-migrations)
- This dataset contains migration information about 742000 researchers.

## Data Preprocessing
Most preprocessing was completed through the following Colab notebooks: [colab1](https://colab.research.google.com/drive/1jCROduC_2fO_8DwCMd7FyVNg0XrgiwbV#scrollTo=cdSqqJsoqQgc) [colab2](https://colab.research.google.com/drive/1jJ0wojjIKTOUKabUuK3KirtAwUuE4_Ic?usp=sharing)

We were dealing with an extremely large dataset where multiple CSV files had millions of rows. We handled this large data by downloading directly from Kaggle into Colab. Some files were too large to process in memory in one go, so we had to process the data in chunks. We handled preprocessing by removing null and inappropriate zero values using Python’s pandas library. We renamed all necessary columns, dropped duplicates, and created new CSV files with our new tables that are in 3NF.

## Web Pages

The web application starts with a login screen. Users can register through email, GitHub, or Google. Signing in sends the user to the home page. The homepage has a beautifully displayed sidebar with icons to clearly differentiate between the different tabs. The web application is divided into numerous pages each fulfilling a different role.

All input fields in the following pages have input validation. For example, inputs expecting a number will only allow a user to type a number and other characters will not register. This will prevent users from performing unwanted queries.

- Migrations - Searches migration information for whether a researcher has migrated and their PhD status. Users can search migration data by filtering by PhD Year, Earliest Year, Has PhD, and Has Migrated.
- Researchers - Retrieves researcher information based on employment and education.
- Bio Entities Searcher - Finds papers that contain the most matches for the searched words. Searching is done with an input field that is comma separated. Each word is checked to make sure it is alpha-numeric for proper validation
- Publications - Searches publications by author id, paper id, author order, and publication year. This page gives more refined information about each paper published.
- Institutions - Shows the percentage of papers written by an author that has migrated for each institution. This page makes use of a range slider to restrict user input.
- Countries - Shows individual country information such as the total papers published, top institutions by number of papers, and the top bio entities. It also concludes the cities in that country with the most employed researchers.
- Two Countries - This tab is essential to show how information and researchers can flow from one country to another. This tab shows information such as the bio entity terms used by authors that have migrated from one country to another as well as other information such as top bio entity terms shared between the two selected countries.
- Visualization - Shows for the top 150 researchers, a 3D interactive graph where the nodes are countries and the edges are the direction of migration. It also includes the number of top researchers from each country that are migrating. The United States was the country in which the most researchers have migrated to. Countries are colored depending on which continents they belong. 

## Query Optimization
<img width="523" alt="Screen Shot 2023-01-05 at 10 08 31 PM" src="https://user-images.githubusercontent.com/54829988/210922090-a06a3cb4-4304-4bdc-b7ca-76239add4260.png">

The above table showcases the increased optimization that was applied to a subset of queries. It can be seen that the optimization yielded significant improvements in the runtime of the query. Some optimization strategies applied were the use of indexes. We prioritized created indexes on columns that were used in select, group by, and order by statements to significantly improve runtime. The existence of these indexes means that the query is able to quickly identify the location of the data on disk. The use of hash-based indexing was prevalent as we had a lot of equality checks. 

Another optimization method applied was push selects and projects as far down as possible. We always tried to select only the columns needed before engaging in expensive join and union operators allowing us to avoid being slowed down by unwanted information.

FInally, another significant method applied was the use of temporary tables. We would find ourselves creating the same temp tables in different queries which reduced performance. We primarily created two temp tables, one is PmidAndidInfo which is used by many of the other queries, and the other is Organization_Paper_Count table which allowed mostBenefitedOrg to improve to under 3 seconds. For demonstration purposes, we added these tables into the database permanently to make testing and demoing significantly easier.

## Testing

1) Navigate terminal to the backend folder.
2) Run `npm test`.

## Contributors

Ruifan Wang, Kevin Bernat, Christian Richmond, Radin Nojoomi
