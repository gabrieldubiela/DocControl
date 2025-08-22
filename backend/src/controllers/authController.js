const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authController = {
  async register(req, res) {
    try {
      const { email, password, setor_id } = req.body;
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Inserir usuário no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .insert([{ email, senha: hashedPassword, setor_id }]);
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  
  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Buscar usuário no Supabase
      const { data: user, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.senha);
      
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, setor_id: user.setor_id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      
      res.json({ token, user: { id: user.id, email: user.email, setor_id: user.setor_id } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;