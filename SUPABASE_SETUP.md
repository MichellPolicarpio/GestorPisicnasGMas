# Configuración de Supabase

## 1. Crear Proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la URL del proyecto y la clave anónima

## 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## 3. Crear Tablas en Supabase

Ejecuta estos SQL en el editor SQL de Supabase:

### Tabla de Usuarios
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'operator', 'viewer')) NOT NULL DEFAULT 'viewer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean su propio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Política para que los usuarios puedan actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Tabla de Piscinas
```sql
CREATE TABLE pools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lon DECIMAL(11, 8) NOT NULL,
  owner TEXT,
  consumption_type TEXT CHECK (consumption_type IN ('residencial', 'comercial', 'industrial', 'publico')),
  status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  captured BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados puedan ver las piscinas
CREATE POLICY "Authenticated users can view pools" ON pools
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para que solo los administradores y operadores puedan insertar
CREATE POLICY "Admins and operators can insert pools" ON pools
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'operator')
    )
  );

-- Política para que solo los administradores y operadores puedan actualizar
CREATE POLICY "Admins and operators can update pools" ON pools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'operator')
    )
  );

-- Política para que solo los administradores puedan eliminar
CREATE POLICY "Only admins can delete pools" ON pools
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );
```

### Tabla de Sensores
```sql
CREATE TABLE pool_sensors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  temperature DECIMAL(5, 2) NOT NULL,
  ph DECIMAL(3, 2) NOT NULL,
  chlorine DECIMAL(4, 2) NOT NULL,
  turbidity DECIMAL(4, 2) NOT NULL,
  water_level DECIMAL(5, 2) NOT NULL,
  oxygen_level DECIMAL(4, 2) NOT NULL,
  alkalinity DECIMAL(6, 2) NOT NULL,
  conductivity DECIMAL(8, 2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE pool_sensors ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados puedan ver los sensores
CREATE POLICY "Authenticated users can view sensors" ON pool_sensors
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para que solo los administradores y operadores puedan insertar
CREATE POLICY "Admins and operators can insert sensors" ON pool_sensors
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'operator')
    )
  );
```

### Tabla de Equipamiento
```sql
CREATE TABLE pool_equipment (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  pump_status BOOLEAN DEFAULT false,
  heater_status BOOLEAN DEFAULT false,
  light_status BOOLEAN DEFAULT false,
  filter_status BOOLEAN DEFAULT false,
  uv_status BOOLEAN DEFAULT false,
  pump_speed INTEGER DEFAULT 0 CHECK (pump_speed >= 0 AND pump_speed <= 100),
  heater_temperature DECIMAL(5, 2) DEFAULT 0,
  last_maintenance DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE pool_equipment ENABLE ROW LEVEL SECURITY;

-- Política para que todos los usuarios autenticados puedan ver el equipamiento
CREATE POLICY "Authenticated users can view equipment" ON pool_equipment
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para que solo los administradores y operadores puedan actualizar
CREATE POLICY "Admins and operators can update equipment" ON pool_equipment
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'operator')
    )
  );
```

## 4. Crear Usuario Administrador

1. Ve a Authentication > Users en el panel de Supabase
2. Crea un nuevo usuario con email y contraseña
3. Ejecuta este SQL para asignar el rol de administrador:

```sql
INSERT INTO users (id, email, name, role)
VALUES (
  'id_del_usuario_creado',
  'admin@masagua.com',
  'Administrador',
  'admin'
);
```

## 5. Configurar Políticas de Seguridad

Las políticas RLS (Row Level Security) ya están configuradas en los scripts SQL anteriores. Estas políticas aseguran que:

- Los usuarios solo pueden ver su propio perfil
- Todos los usuarios autenticados pueden ver las piscinas y sensores
- Solo administradores y operadores pueden crear/editar piscinas
- Solo administradores pueden eliminar piscinas

## 6. Probar la Conexión

Una vez configurado todo, reinicia el servidor de desarrollo:

```bash
npm run dev
```

El sistema debería conectarse automáticamente a Supabase y usar la autenticación real en lugar de las credenciales de prueba.
