# Project Plan: Universe Website

## I. Backend Development (Kotlin, GraphQL, PostgreSQL)

1. **Project Setup**

- Create a new Spring Boot project using Spring Initializr or your IDE.
  - Choose Kotlin as the language.
  - Include the following dependencies:
    - Spring Web
    - Spring Data JPA
    - PostgreSQL Driver
    - GraphQL Kotlin Spring Server

2. **PostgreSQL Setup**

- Install PostgreSQL locally or set up a cloud-based PostgreSQL instance (e.g., Heroku Postgres, AWS RDS).
- Create a database named `universe`.

3. **Data Modeling**

- Define Kotlin data classes to represent your domain models (e.g., `Planet`, `Star`, `User`).

  - Annotate classes and fields with JPA annotations (`@Entity`, `@Id`, `@GeneratedValue`, `@ManyToOne`, `@ManyToMany` etc.) to define database tables and relationships.
  - Include relevant properties (e.g., `name`, `mass`, `radius`, `habitabilityIndex` for `Planet`).
  - Example:

  ```kotlin
  @Entity
  data class Planet (
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      val id: Long? = null,
      val name: String,
      val mass: Float,
      val radius: Float,
      val temperature: Float,
      val habitabilityIndex: Float,
      var imageUrl: String? = null,

      @ManyToOne
      @JoinColumn(name = "star_id")
      val star: Star,

      @ManyToOne
      @JoinColumn(name = "user_id")
      val user: User
  )

  @Entity
  data class Star (
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      val id: Long? = null,
      val name: String,
      // ... other star properties
  )

  @Entity
  data class User (
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      val id: Long? = null,
      val username: String,
      // ... other user properties
  )
  ```

4. **GraphQL Schema Definition**

- Define your GraphQL schema using the `graphql-kotlin` library.

  - Specify the types, queries, mutations, and subscriptions your API will support.
  - Example:

        ```graphql
        type Planet {
          id: ID!
          name: String!
          mass: Float
          radius: Float
          habitabilityIndex: Float
          # ... other properties
        }

        type Query {
          planets: [Planet]
          planet(id: ID!): Planet
        }

        type Mutation {
          createPlanet(name: String!, mass: Float, radius: Float): Planet
        }
        ```

5. **Resolvers Implementation**

- Implement resolver functions for each query, mutation, and subscription in your schema.

  - Resolvers fetch data from MongoDB and return it in the format specified by your schema.
  - Example:

        ```kotlin
        @Component
        class PlanetResolver(@Autowired val planetRepository: PlanetRepository) { // Assuming you have a PlanetRepository

          fun planets(): List<Planet> {
            return planetRepository.findAll()
          }

          fun planet(id: String): Planet {
            return planetRepository.findById(id)
          }

          fun createPlanet(name: String, mass: Float, radius: Float): Planet {
            val newPlanet = Planet(name = name, mass = mass, radius = radius)
            return planetRepository.save(newPlanet)
          }
        }
        ```

6. **API Testing**

- Write unit and integration tests for your GraphQL API.
  - Use a testing library like `graphql-kotlin-spring-test` to send GraphQL requests and verify responses.

7. **Deployment**

- Deploy your backend application to a server or cloud platform (e.g., Heroku, AWS, Google Cloud).

**II. Frontend Development (TypeScript, React, Tailwind CSS, Framer Motion)**

1. **Project Setup**

- Create a new React project using Create React App with the TypeScript template:

  ```bash
  npx create-react-app my-universe-website --template typescript
  ```

- Install the following dependencies:
  - `tailwindcss`
  - `postcss`
  - `autoprefixer`
  - `framer-motion`
  - `@apollo/client` (or your preferred GraphQL client)

2. **Tailwind CSS Setup**

- Initialize Tailwind CSS in your project:

  ```bash
  npx tailwindcss init -p
  ```

- Configure `tailwind.config.js` and `postcss.config.cjs` to include your template paths.
- Add the Tailwind directives to your main CSS file (e.g., `index.css`):

  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

3. **Component Structure**

- Plan the layout and components of your website.
  - Create reusable components for common elements (e.g., header, navigation, planet cards).
  - Example component structure:
    - `HomePage`
    - `ExoplanetCatalog`
    - `PlanetDetails`
    - `MyExoplanets`
    - `PlanetCreationForm`
    - `PlanetComparisonTool`

4. **GraphQL Integration**

- Set up your GraphQL client (e.g., Apollo Client) to connect to your backend API.
- Write GraphQL queries and mutations to fetch and update data from your backend.
- Use the `useQuery` and `useMutation` hooks (or equivalent) to integrate GraphQL data into your components.

5. **UI Development**

- Implement the UI for each component using React and Tailwind CSS.
  - Style your components according to your design plan.
  - Use Tailwind's utility classes for rapid styling and responsiveness.

6. **Animations with Framer Motion**

- Add animations and transitions to your UI using Framer Motion.

  - Animate page transitions, component entrances/exits, and interactive elements.
  - Example:

        ```typescript
        import { motion } from 'framer-motion';

        const PlanetCard: React.FC<PlanetProps> = ({ planet }) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-4 shadow-md"
          >
            {/* ... planet details */}
          </motion.div>
        );
        ```

7. **Data Visualization**

- Integrate data visualization libraries (e.g., D3.js, Chart.js, Recharts) to create charts and graphs.
  - Visualize exoplanet properties, habitability indexes, and comparisons.

8. **User Authentication (Optional)**

- Implement user authentication if you want users to create and save their own exoplanets.
  - Use a library like `auth0` or `firebase-auth` to handle authentication.

9. **Testing**

- Write unit and integration tests for your frontend components and logic.
  - Use a testing library like Jest and React Testing Library.

10. **Deployment**

- Deploy your frontend application to a hosting platform (e.g., Netlify, Vercel, AWS).

**III. Ongoing Development**

- **Refinement:** Continuously refine your UI, animations, and data visualizations based on user feedback and testing.
- **New Features:** Add new features and functionality to your website over time (e.g., 3D visualizations, more advanced filtering options, community features).
- **Performance Optimization:** Optimize your backend and frontend code for performance and scalability.
