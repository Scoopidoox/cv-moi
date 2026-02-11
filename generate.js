const fs = require('fs');
const yaml = require('js-yaml');

try {
    const fileContents = fs.readFileSync('./cv.yaml', 'utf8');
    let data = yaml.load(fileContents) || {};
    
    // Sécurisation des données
    data.infos = data.infos || {};
    data.infos.contact = data.infos.contact || {};
    data.infos.liens = data.infos.liens || {};
    data.competences = data.competences || [];
    data.experiences = data.experiences || [];
    data.formations = data.formations || [];
    data.langues = data.langues || [];
    data.soft_skills = data.soft_skills || [];
    data.certifications = data.certifications || [];
    data.passions = data.passions || [];

    const getPhotoSrc = (photo) => {
        if (!photo) return null;
        if (photo.startsWith('data:image')) return photo;
        return photo;
    };
    const photoSrc = getPhotoSrc(data.infos.photo);

    const cleanUrl = (url) => {
        if (!url) return '';
        return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
    };

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>CV ${data.infos.nom || 'Candidat'}</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            :root {
                --primary: #0f172a;
                --accent: #0ea5e9;
                --text-dark: #334155;
                --text-light: #94a3b8;
                --sidebar-text: #e2e8f0;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #cbd5e1;
                margin: 0;
                display: flex;
                justify-content: center;
                color: var(--text-dark);
                -webkit-print-color-adjust: exact;
            }

            .page {
                width: 210mm;
                min-height: 297mm;
                background: white;
                display: grid;
                grid-template-columns: 30% 70%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                margin: 20px 0;
                position: relative; /* Pour positionnement */
            }

            /* --- SIDEBAR --- */
            aside {
                background: var(--primary);
                color: white;
                padding: 30px 20px;
                display: flex; flex-direction: column; font-size: 13px;
            }

            .photo-container { margin-bottom: 25px; display: flex; justify-content: center; }
            .profile-photo {
                width: 140px; height: 140px; object-fit: cover;
                border-radius: 12px; border: 3px solid var(--accent); background-color: white;
            }
            .photo-placeholder {
                width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 12px;
                display: flex; align-items: center; justify-content: center;
                color: var(--accent); font-weight: bold; border: 2px dashed var(--accent);
            }

            .sidebar-group { margin-bottom: 25px; }
            aside h2 {
                color: var(--accent); font-size: 14px; text-transform: uppercase;
                letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.15);
                padding-bottom: 6px; margin-bottom: 12px; font-weight: 700;
            }

            .info-row { display: flex; align-items: center; margin-bottom: 10px; color: var(--sidebar-text); }
            .icon-box { width: 20px; display: flex; justify-content: center; margin-right: 10px; color: var(--accent); font-size: 14px; }
            
            .link-text { 
                color: var(--sidebar-text); text-decoration: none; 
                border-bottom: 1px dotted rgba(255,255,255,0.3); transition: 0.2s;
                word-break: break-all; font-size: 11px;
            }

            .tags-cloud { display: flex; flex-wrap: wrap; gap: 6px; }
            .tag-dark { background: rgba(255,255,255,0.08); padding: 3px 8px; border-radius: 4px; font-size: 11px; color: var(--sidebar-text); }
            .tag-light { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid #e2e8f0; }

            .lang-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .lang-level { color: var(--accent); font-size: 11px; font-weight: 600; }

            /* --- MAIN --- */
            main { padding: 40px 35px; display: flex; flex-direction: column; }
            header { margin-bottom: 25px; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
            h1 { margin: 0; font-size: 34px; text-transform: uppercase; color: var(--primary); line-height: 1; letter-spacing: -1px; }
            .job-title { font-size: 16px; font-weight: 700; color: var(--accent); margin-top: 5px; text-transform: uppercase; }
            .summary { margin-top: 15px; font-size: 13px; line-height: 1.6; color: var(--text-dark); }

            .section-title {
                font-size: 16px; font-weight: 700; color: var(--primary);
                display: flex; align-items: center; margin-bottom: 15px; margin-top: 20px;
                text-transform: uppercase;
            }
            .section-icon { 
                background: #e0f2fe; color: var(--accent); 
                width: 28px; height: 28px; border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                margin-right: 10px; font-size: 14px;
            }

            .exp-item { margin-bottom: 18px; border-left: 2px solid #e2e8f0; padding-left: 15px; margin-left: 10px; }
            .exp-header { display: flex; justify-content: space-between; align-items: baseline; }
            .exp-role { font-weight: 700; font-size: 14px; color: var(--primary); }
            .exp-date { font-size: 12px; color: #64748b; font-weight: 600; }
            .exp-company { font-size: 13px; font-weight: 600; color: var(--accent); margin-bottom: 4px; }
            .exp-details { padding-left: 0; margin: 4px 0; list-style-position: inside; }
            .exp-details li { font-size: 12px; color: #475569; margin-bottom: 2px; line-height: 1.4; }
            .exp-details li::marker { color: var(--accent); font-size: 10px; }

            .edu-item { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; }
            .edu-diploma { font-weight: 700; color: var(--primary); }
            .edu-school { color: #64748b; font-size: 12px; }
            .edu-year { font-weight: 600; color: var(--accent); font-size: 12px; min-width: 80px; text-align: right; }

            .certif-box { 
                background: #f8fafc; border: 1px solid #e2e8f0; 
                padding: 8px; border-radius: 6px; font-size: 12px; 
                color: #334155; font-weight: 500; display: flex; align-items: center; margin-bottom: 6px;
            }

            /* STYLE DU BOUTON FLOTTANT */
            .download-btn {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: var(--accent);
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 50px;
                font-family: 'Inter', sans-serif;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
                transition: transform 0.2s, background 0.2s;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 1000;
            }
            .download-btn:hover {
                background-color: #0284c7;
                transform: translateY(-2px);
            }

            @media print {
                body { background: white; margin: 0; }
                .page { box-shadow: none; margin: 0; width: 100%; height: 100%; }
                @page { margin: 0; size: A4; }
                aside, .section-icon { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                
                /* CACHER LE BOUTON À L'IMPRESSION */
                .download-btn { display: none !important; }
            }
        </style>
    </head>
    <body>
        
        <button class="download-btn" onclick="window.print()">
            <i class="fa-solid fa-file-pdf"></i> Télécharger en PDF
        </button>

        <div class="page">
            <aside>
                <div class="photo-container">
                    ${photoSrc ? `<img src="${photoSrc}" class="profile-photo">` : `<div class="photo-placeholder">PHOTO</div>`}
                </div>

                <div class="sidebar-group">
                    <h2>Contact</h2>
                    <div class="info-row"><div class="icon-box"><i class="fa-solid fa-cake-candles"></i></div> <span>${data.infos.age || ''}</span></div>
                    <div class="info-row"><div class="icon-box"><i class="fa-solid fa-location-dot"></i></div> <span>${data.infos.contact.localisation || ''}</span></div>
                    <div class="info-row"><div class="icon-box"><i class="fa-solid fa-envelope"></i></div> <span>${data.infos.contact.email || ''}</span></div>
                    <div class="info-row"><div class="icon-box"><i class="fa-solid fa-phone"></i></div> <span>${data.infos.contact.tel || ''}</span></div>
                    <div class="info-row"><div class="icon-box"><i class="fa-solid fa-car"></i></div> <span>${data.infos.contact.permis || ''}</span></div>
                </div>

                <div class="sidebar-group">
                    <h2>Liens</h2>
                    <div class="info-row">
                        <div class="icon-box"><i class="fa-solid fa-globe"></i></div> 
                        <a href="https://${data.infos.liens.portfolio}" class="link-text">${cleanUrl(data.infos.liens.portfolio)}</a>
                    </div>
                    <div class="info-row">
                        <div class="icon-box"><i class="fa-brands fa-linkedin"></i></div> 
                        <a href="https://${data.infos.liens.linkedin}" class="link-text">${cleanUrl(data.infos.liens.linkedin)}</a>
                    </div>
                    <div class="info-row">
                        <div class="icon-box"><i class="fa-brands fa-github"></i></div> 
                        <a href="https://${data.infos.liens.github}" class="link-text">${cleanUrl(data.infos.liens.github)}</a>
                    </div>
                </div>

                <div class="sidebar-group">
                    <h2>Compétences</h2>
                    ${data.competences.map(cat => `
                        <div style="margin-bottom:12px;">
                            <div style="font-size:11px; font-weight:700; color:#cbd5e1; margin-bottom:4px; text-transform:uppercase;">${cat.categorie}</div>
                            <div class="tags-cloud">
                                ${cat.skills.map(s => `<span class="tag-dark">${s}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="sidebar-group">
                    <h2>Langues</h2>
                    ${data.langues.map(l => `
                        <div class="lang-row">
                            <span>${l.langue}</span>
                            <span class="lang-level">${l.niveau}</span>
                        </div>
                    `).join('')}
                </div>
            </aside>

            <main>
                <header>
                    <h1>${data.infos.nom || ''}</h1>
                    <div class="job-title">${data.infos.titre || ''}</div>
                    <div class="summary">${data.infos.accroche || ''}</div>
                </header>

                <div class="section-title">
                    <div class="section-icon"><i class="fa-solid fa-briefcase"></i></div> Expériences
                </div>
                ${data.experiences.map(exp => `
                    <div class="exp-item">
                        <div class="exp-header">
                            <span class="exp-role">${exp.poste}</span>
                            <span class="exp-date">${exp.date}</span>
                        </div>
                        <div class="exp-company">${exp.entreprise} | ${exp.lieu}</div>
                        <ul class="exp-details">
                            ${(exp.details || []).map(d => `<li>${d}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}

                <div class="section-title">
                    <div class="section-icon"><i class="fa-solid fa-graduation-cap"></i></div> Formations
                </div>
                ${data.formations.map(f => `
                    <div class="edu-item">
                        <div>
                            <div class="edu-diploma">${f.diplome}</div>
                            <div class="edu-school">${f.ecole}</div>
                        </div>
                        <div class="edu-year">${f.annee}</div>
                    </div>
                `).join('')}

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-top:20px;">
                    <div>
                        <div class="section-title" style="margin-top:0;">
                            <div class="section-icon"><i class="fa-solid fa-certificate"></i></div> Certifications
                        </div>
                        ${data.certifications.map(c => `
                            <div class="certif-box"><i class="fa-solid fa-check-circle" style="color:var(--accent); margin-right:8px;"></i> ${c}</div>
                        `).join('')}
                    </div>
                    <div>
                        <div class="section-title" style="margin-top:0;">
                            <div class="section-icon"><i class="fa-solid fa-heart"></i></div> Passions
                        </div>
                        <div class="tags-cloud" style="gap:8px;">
                            ${data.passions.map(p => `<span class="tag-light">${p}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div style="margin-top: 25px;">
                    <div class="section-title">
                        <div class="section-icon"><i class="fa-solid fa-user-gear"></i></div> Soft Skills
                    </div>
                    <div class="tags-cloud" style="gap:10px;">
                        ${data.soft_skills.map(s => `<span class="tag-light" style="background:#fff; border-color:var(--accent); color:var(--primary);">${s}</span>`).join('')}
                    </div>
                </div>
            </main>
        </div>
    </body>
    </html>
    `;

    fs.writeFileSync('./cv.html', htmlContent);
    console.log("✅ CV terminé avec bouton PDF !");

} catch (e) {
    console.log("❌ Erreur :", e.message);
}