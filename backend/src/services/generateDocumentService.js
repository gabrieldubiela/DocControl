const genAI = require('../config/gemini');

const generateDocumentService = {
  async generate(prompt, tipoDocumento) {
    try {
      // Obter o modelo
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      // Criar um prompt aprimorado com base no tipo de documento
      const enhancedPrompt = `Gere um conteúdo para um ${tipoDocumento} com base nas seguintes informações: ${prompt}. 
      O conteúdo deve ser formatado em HTML, adequado para um documento formal, com parágrafos bem estruturados e 
      linguagem profissional.`;
      
      // Gerar conteúdo
      const result = await model.generateContent(enhancedPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      throw new Error(`Erro ao gerar conteúdo: ${error.message}`);
    }
  }
};

module.exports = generateDocumentService;