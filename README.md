### 1️⃣ **Clona y configura el repositorio**

`git clone https://github.com/doblel09/csiapp.git`

### 2️⃣ **Actualiza tu entorno local**

Antes de comenzar:

`git checkout development 
`
`git pull origin development`

### 3️⃣ **Crea un archivo `appsettings.local.json` dentro de la carpeta CSIApp**

```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server={agrega tu servidor sqlserver};Database=CSIDB;Trusted_Connection=true;TrustServerCertificate=true"
  },
    "Logging": {
      "LogLevel": {
        "Default": "Information",
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "AllowedHosts": "*"
  }
```
### 4️⃣ ***Verificar las migraciones pendientes***

Para verificar las migraciones pendientes (migraciones que no se han aplicado a la base de datos), puedes ejecutar el siguiente comando en la consola de NuGet:

`Get-Migrations`

**Actualizar la base de datos**:
Para aplicar las migraciones pendientes y actualizar tu base de datos, utiliza el siguiente comando en la consola de NuGet:

`Update-Database`
