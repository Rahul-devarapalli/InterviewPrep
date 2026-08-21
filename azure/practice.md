# Azure Cloud — Practice Questions

Attempt these cold, without checking `questions.md`. Ordered easy → hard.
No answers given — hints only. Log anything you got stuck on in `README.md` under **Weak Spots**.

---

1. **How do you deploy a basic Node.js application to Azure App Service using the Azure CLI?**
   _Hint: Think about `az webapp up` or creating an App Service Plan first._

2. **What is the difference between an Azure Storage Account SAS token and an Access Key?**
   _Hint: One grants full admin control, the other provides granular, time-limited access._

3. **How do you pass a secret from Azure Key Vault to an Azure App Service without writing any code?**
   _Hint: Look into Key Vault references (`@Microsoft.KeyVault(...)`) and Managed Identities._

4. **Describe the process of setting up a CI/CD pipeline for a Next.js app in Azure DevOps.**
   _Hint: Mention the YAML pipeline, npm install, build steps, and the `AzureRmWebAppDeployment` task._

5. **Why would you choose Azure Service Bus Topics over Service Bus Queues?**
   _Hint: Think about single receiver (1:1) vs. multiple independent subscribers (1:N or pub/sub)._

6. **How do you securely connect an Azure App Service to an Azure SQL Database so that the database is not exposed to the public internet?**
   _Hint: Consider VNet integration on the App Service side and a Private Endpoint on the SQL side._

7. **Explain the difference between ARM templates, Bicep, and Terraform for Azure deployments.**
   _Hint: Think about JSON verbosity, Azure-native domain-specific language, and cloud-agnostic state management._

8. **How do you implement a blue-green deployment for an Azure Function or App Service?**
   _Hint: Use Deployment Slots, deploy to the staging slot, warm it up, and perform a VIP swap._

9. **Your Cosmos DB partition key is set to `tenantId`, but one tenant generates 90% of your traffic. What issue does this cause and how do you fix it?**
   _Hint: This is a "Hot Partition". Consider creating a synthetic partition key by appending a random number or date._

10. **Design a highly available, multi-region architecture for a Next.js frontend and Node.js API hosted on Azure.**
    _Hint: Incorporate Azure Front Door for global routing, paired regions, App Services in multiple regions, and Cosmos DB with multi-region writes._
