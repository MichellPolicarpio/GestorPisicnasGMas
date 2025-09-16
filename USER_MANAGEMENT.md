# Gestión de Usuarios en Supabase

## 📋 **Cómo Agregar Usuarios al Sistema**

### **1. Acceder al Dashboard de Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto: `rmepdyyincgueaxngloa`

### **2. Agregar Usuarios desde Authentication**

#### **Opción A: Agregar Usuario Manualmente**
1. Ve a **Authentication** > **Users**
2. Haz clic en **"Add user"**
3. Completa los campos:
   - **Email**: `usuario@empresa.com`
   - **Password**: `contraseña_segura`
   - **Email Confirm**: ✅ (marcado)
4. Haz clic en **"Add user"**

#### **Opción B: Invitar Usuario por Email**
1. Ve a **Authentication** > **Users**
2. Haz clic en **"Invite user"**
3. Ingresa el email del usuario
4. El usuario recibirá un email para establecer su contraseña

### **3. Configurar Metadatos del Usuario**

Después de crear el usuario, puedes agregar información adicional:

1. Ve a **Authentication** > **Users**
2. Haz clic en el usuario que quieres editar
3. En la sección **"Raw user meta data"**, agrega:

```json
{
  "name": "Nombre del Usuario",
  "role": "admin"
}
```

**Roles disponibles:**
- `admin` - Administrador (acceso completo)
- `operator` - Operador (acceso limitado)
- `viewer` - Visualizador (solo lectura)

### **4. Configurar Permisos de Usuario**

#### **Para Administradores:**
```json
{
  "name": "Juan Administrador",
  "role": "admin"
}
```

#### **Para Operadores:**
```json
{
  "name": "María Operadora",
  "role": "operator"
}
```

#### **Para Visualizadores:**
```json
{
  "name": "Carlos Visualizador",
  "role": "viewer"
}
```

### **5. Gestionar Usuarios Existentes**

#### **Editar Usuario:**
1. Ve a **Authentication** > **Users**
2. Haz clic en el usuario
3. Modifica los metadatos o información
4. Guarda los cambios

#### **Eliminar Usuario:**
1. Ve a **Authentication** > **Users**
2. Haz clic en el usuario
3. Haz clic en **"Delete user"**
4. Confirma la eliminación

#### **Resetear Contraseña:**
1. Ve a **Authentication** > **Users**
2. Haz clic en el usuario
3. Haz clic en **"Send password reset"**
4. El usuario recibirá un email para cambiar su contraseña

### **6. Configuración de Seguridad**

#### **Configurar URLs Permitidas:**
1. Ve a **Authentication** > **Settings**
2. En **Site URL**: `http://localhost:3000` (desarrollo)
3. En **Redirect URLs**: 
   - `http://localhost:3000/login` (desarrollo)
   - `https://tu-dominio.com/login` (producción)

#### **Configurar Políticas de Contraseña:**
1. Ve a **Authentication** > **Settings**
2. En **Password Policy**:
   - Mínimo 8 caracteres
   - Requerir mayúsculas y minúsculas
   - Requerir números
   - Requerir símbolos

### **7. Monitoreo de Usuarios**

#### **Ver Actividad de Usuarios:**
1. Ve a **Authentication** > **Users**
2. Cada usuario muestra:
   - Última actividad
   - Fecha de creación
   - Estado de verificación
   - Método de autenticación

#### **Ver Logs de Autenticación:**
1. Ve a **Logs** > **Auth**
2. Revisa los intentos de login
3. Monitorea actividades sospechosas

### **8. Ejemplo de Usuario Completo**

```json
{
  "name": "Ana García",
  "role": "admin",
  "avatar_url": "https://ejemplo.com/avatar.jpg",
  "department": "IT",
  "phone": "+52 123 456 7890"
}
```

### **9. Comandos Útiles**

#### **Crear Usuario desde SQL (Opcional):**
```sql
-- Crear usuario directamente en auth.users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'usuario@empresa.com',
  crypt('contraseña123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Usuario Ejemplo", "role": "admin"}'
);
```

### **10. Troubleshooting**

#### **Usuario no puede hacer login:**
1. Verificar que el email esté correcto
2. Verificar que la contraseña sea correcta
3. Verificar que el usuario esté confirmado
4. Revisar los logs de autenticación

#### **Error de permisos:**
1. Verificar que el rol esté configurado correctamente
2. Verificar que los metadatos estén bien formateados
3. Verificar que el usuario tenga el rol correcto

#### **Error de redirección:**
1. Verificar que las URLs estén configuradas correctamente
2. Verificar que el dominio esté permitido
3. Verificar que no haya errores de CORS

---

## 📞 **Soporte**

Para problemas técnicos o dudas sobre la gestión de usuarios, contacta al administrador del sistema.
