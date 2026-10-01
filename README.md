# SS — Sustentabilidade & Segurança

Plataforma digital voltada para **motociclistas e usuários de veículos de duas rodas**, especialmente veículos elétricos e autopropelidos (patinetes elétricos, e-bikes, ciclomotores, monociclos e motos).

O projeto une **educação preventiva de trânsito** e **tecnologia de identificação inteligente** com QR Code nos termos da **LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)**.

---

## 🌟 Funcionalidades Principais

1. **Cadastro Completo de Usuários e Veículos:**
   - Suporte à detecção automática de condutores menores de 18 anos com inclusão de responsável legal.
   - Geração automática de identificador alfanumérico único no padrão `SS-XXXXXX`.
2. **Curso Online Educativo (6 Módulos Didáticos):**
   - 🚦 Sinalização Viária (semáforos, placas e pintura de solo).
   - 🛵 Condução Segura e Defensiva (distância de frenagem e pontos cegos).
   - 🪖 Equipamentos de Segurança (capacete com selo INMETRO, luvas, jaqueta e calçados).
   - ⚠️ Situações de Risco (contramão, invasão de calçadas, excesso de velocidade).
   - ⚡ Veículos Elétricos & Autopropelidos (Resolução CONTRAN nº 996/2023).
   - 🤝 Responsabilidade Coletiva & Prevenção de Acidentes.
3. **Avaliação Prática de Trânsito:**
   - Casos reais do cotidiano das cidades com nota mínima para aprovação (80%).
4. **Certificação Oficial SS:**
   - Certificado digital com autenticidade verificável, pronto para impressão e download em PDF.
5. **QR Code Inteligente & Adesivo Físico do Veículo (Proteção LGPD):**
   - O QR Code afixado no veículo **NÃO expõe dados pessoais** (sem CPF, sem endereço, sem telefone).
   - Ao escanear, o cidadão comum vê apenas que o veículo é cadastrado e regular.
6. **Sistema de Alerta de Veículo Roubado / Furtado:**
   - Se o veículo for subtraído, o condutor ativa o alerta em 1 clique na área "Meu SS".
   - O QR Code passa imediatamente a disparar aviso vermelho chamativo com instruções para acionar o 190 (Polícia Militar).
   - Quando recuperado, o proprietário reativa o status normal com outro clique.
7. **Área "Meu SS" (Área Pessoal do Titular):**
   - Consulta e edição dos próprios dados pessoais em conformidade com a LGPD.
   - Gerenciamento de status do veículo e impressão da etiqueta adesiva.
8. **Área de Acesso Restrito para Agentes Autorizados:**
   - Acesso institucional via login e matrícula validada (DETRAN, Polícia Militar, Guarda Municipal, Prefeitura).
   - Scanner de câmera em tempo real para leitura de QR Code em abordagens.
   - Consulta completa dos dados do proprietário para fiscalização educativa ou socorro em acidentes.
   - Registro de notas de orientação educativa (o SS não aplica multas).
9. **Palestras Presenciais, Parcerias Institucionais & Apoiadores:**
   - Apresentação para prefeituras e canais de adesão para lojistas e patrocinadores.

---

## 📁 Estrutura de Arquivos

```
ve-consciente/
├── index.html          # Página Inicial da plataforma SS
├── cadastro.html       # Cadastro integrado do condutor e veículo
├── curso.html          # Curso online com os 6 módulos
├── avaliacao.html      # Avaliação de situações práticas do trânsito
├── certificado.html    # Emissão e impressão do Certificado SS
├── meu-ss.html         # Área privada do usuário (Meu SS, LGPD, Alertas e Adesivo)
├── consulta.html       # Consulta pública do QR Code (tela do cidadão)
├── agentes.html        # Área restrita para agentes autorizados com scanner
├── palestras.html      # Palestras presenciais, parcerias e apoiadores
├── netlify.toml        # Configuração de deploy e segurança no Netlify
└── assets/
    ├── css/
    │   └── style.css   # Identidade visual moderna e responsiva
    └── js/
        └── app.js      # Banco de dados local, criptografia LGPD e regras de negócio
```

---

## 🔑 Credenciais Institucionais de Teste (Área de Agentes)

- **DETRAN-PR:** Matrícula `DETRAN-2026` | Senha: `detran2026`
- **Polícia Militar:** Matrícula `PM-190` | Senha: `pm190`
- **Guarda Municipal:** Matrícula `GM-153` | Senha: `guarda2026`

---

## 🚀 Como Hospedar no Netlify

1. Faça o push dos arquivos para o repositório GitHub.
2. No Netlify, selecione o repositório `VE-Consciente`.
3. Diretório de publicação: `.` (raiz).
4. O site estará online imediatamente com certificado HTTPS gratuito!
