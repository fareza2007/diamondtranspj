import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const privateKey = (
  process.env.FIREBASE_PRIVATE_KEY ||
  `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCphuOeI6FLiOxR\nFMQBSnKHHh18p1e4R2Mk8w1Z9WK1av3ttJJAUfVSJRNNycgAc5lOZqtmxiSmLY86\nqB419mnFz12VSsnGGY1fu0XC/HflV9SEPkSLkaHmuKurGZg6OVgp5wv3A5WAwzyK\n1p6Q9QYCK5Bdura13dKwnDTzBBplQB9EywziyN/qa4uwoDPXixUHtJeO4u4RpuGs\nAQz/+woZocpUQibEZehNGOauACStTktpsI4dGiHIE5yCwNrOzgyUZ1OpQGh0X1yc\nohuck8FjY2UOPUVz1KAngxiovt6IsF0JCTOIZXRGlT1XCQ7VNur66ZKKlb36WNKC\nEtE+aDdJAgMBAAECggEABuDNLWZerfThOazxAuhlWywSoDMd8QEceaxO116IYbn0\nkYdpA6kPngSZEufj8HjAOJkbzTCu3fstO4EEsMXNptPyBROiuiHhRYgQnYemyaxV\nmAP6vfrrqbPGa0u/jGU1OYYBS0Ve9Hl3ZF6u0kzOsJnZ4qOntBtK6BV+ZHm/JGpz\nrn4demIgmb7xJSLSP4hhWmXDY0IAxMGMRzBH9F15Fb3JLr/yRrRVOrL76Z/H59pY\nvQH5ObaE4JDc/xx6GIY49z+1zQmwFzfLP1r6AN7PNinmBbgdmoxLgYM7eOZlLazR\nZq9be/yGqdCDTk8TdCGcdXfzqHUeI0wLBbfMYf2ZcQKBgQDZvW5vOdTrDBpX75ul\nSQwcXQZAhwnEtBe+g/ECOdprTAg4tedxNLUEPDLwDRYLFHNhWyKhEN5qdwGiqgOX\nFPqdoddR9JaemGfJIvXXYAEyALG/j0c6ytxsZUjysvU5Y5BMyJgvd95s0bYxGM6+\nvJLb0b0C7jnV7MG7IuZF5ZmQFQKBgQDHULI1cMPqe5TMialxKHp1E+Z9cW0i8CiA\nw02lPGkSy8h2g2Joq3TSDyUP5AyEHU7GTdYDzJ5wcuNrjU8anZYO0WDThGGqMXjU\nvJBPzffugnRlgjiiVBArf1cIY/DrIajdj8v7LIsCnCKfXwV60rzXgVL2lmlT8H9H\nucmoigGjZQKBgQCLwNow6Z2Pf6Uo69GqtMfhLJPmtsW+SxkyXt1B4IAgfhyIybhT\nINFOdpT7HmsXkXi89BG1723SR6/1B8pmHkD9C/N31tUV1hxHLPk905Dw1yE/ImdF\nhQ8VQ60emV5sB0uG/Pkw/m70yWV2/cU1BzP7gxMd3mmgtOVjh3LlSgjWQQKBgCS1\nQf0BpbN7yy3YdLJ4iAUkAyE7UKRMoskELzqtY5Son2TkUa2BVmSRkXvZvkxesXFo\nSHAusUd4gVX/koAOYeKcwT5zdSFJNz3G9LUd8/mjYRiI4TFUVh4Mt9S9w1MqwdT8\ndM7vpzJ12xKLB5FVWp4+HS95CDEDbA2js/YsZJzZAoGBAJTlaxRO85Rrt4F74efk\n2ECFIF+B9PoZKNDqx2cOLPmMsfPFqNGG7OygC/e2xp7ZA8YsBsIPadq13x8ocHml\nKfSyf7wElaKPb11hhVJS7WDhE5u8w6YorA+ccn8geP4Zv1zQSGJ7KuoMt2hks0OL\n6GZdKQ+4OR6+8vZezFq0u8ZA\n-----END PRIVATE KEY-----\n`
).replace(/\\n/g, "\n");

const adminApp = !getApps().length
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID || "diamontrans-2ba21",
        clientEmail:
          process.env.FIREBASE_CLIENT_EMAIL ||
          "firebase-adminsdk-fbsvc@diamontrans-2ba21.iam.gserviceaccount.com",
        privateKey,
      }),
    })
  : getApps()[0];

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
