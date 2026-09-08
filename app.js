let journey='account',accountStep=1,kycStep=1,fpStep=1,kybStep=1,consent=false,type='individual',otpSent=false,hasOtherNationality=false,sdkStep=0,sdkDoc='Passport',corrDifferent=false,uploads=0;
const accountNames=['Account','Phone','Account type','Ready'];
const kycNames=['Profile','Identity','Address','Review','Complete'];
const fpNames=['Employment','Source of Funds','Source of Wealth','Activity','Review','Reviewing','Complete'];
const kybNames=['Company','Address','Business profile','PEP','Key roles','Documents','Review & submit','Reviewing','Complete'];
const accountScreens=[...document.querySelectorAll('.account-screen')];
const kycScreens=[...document.querySelectorAll('.kyc-screen')];
const fpScreens=[...document.querySelectorAll('.fp-screen')];
const kybScreens=[...document.querySelectorAll('.kyb-screen')];
function showOnly(screen){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));screen.classList.add('active')}
function updateProgress(){const names=journey==='account'?accountNames:(journey==='kyc'?kycNames:(journey==='fp'?fpNames:kybNames));const step=journey==='account'?accountStep:(journey==='kyc'?kycStep:(journey==='fp'?fpStep:kybStep));const total=names.length;stepText.textContent=`Step ${step} of ${total}`;stepName.textContent=names[step-1];bar.style.width=(step/total*100)+'%';headerTag.classList.toggle('show',journey!=='account');headerTag.textContent=journey==='fp'?'Individual KYC · Financial Profile':(journey==='kyb'?'Business KYB':'Individual KYC')}
function goAccount(n){journey='account';accountStep=n;showOnly(accountScreens[n-1]);updateProgress();window.scrollTo({top:0,behavior:'smooth'})}
function goKyc(n){journey='kyc';kycStep=n;showOnly(kycScreens[n-1]);updateProgress();window.scrollTo({top:0,behavior:'smooth'})}
function goFp(n){journey='fp';fpStep=n;showOnly(fpScreens[n-1]);updateProgress();window.scrollTo({top:0,behavior:'smooth'});if(n===1)toggleEmployerPanel()}
function goKyb(n){journey='kyb';kybStep=n;showOnly(kybScreens[n-1]);updateProgress();window.scrollTo({top:0,behavior:'smooth'})}
function backToAccount(){goAccount(4)}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
function refreshEmailButton(){emailContinue.disabled=!(validEmail(email.value)&&consent)}
email.addEventListener('input',()=>{emailField.classList.remove('invalid');refreshEmailButton()});
function openConsent(){legalModal.classList.add('show');legalScroll.scrollTop=0;agreeBtn.disabled=true;scrollHint.textContent='Scroll to the bottom to enable approval.'}
function closeConsent(){legalModal.classList.remove('show')}
function backdrop(e){if(e.target===e.currentTarget)closeConsent()}
function checkScroll(){const ok=legalScroll.scrollTop+legalScroll.clientHeight>=legalScroll.scrollHeight-10;agreeBtn.disabled=!ok;scrollHint.textContent=ok?'You reached the end. You can now approve.':'Scroll to the bottom to enable approval.'}
function approveConsent(){consent=true;consentRow.classList.add('approved');closeConsent();refreshEmailButton();toast('Legal agreements accepted')}
function continueEmail(){if(!validEmail(email.value)){emailField.classList.add('invalid');return}if(!consent)return;goAccount(2)}
function sendOtp(){if(!phone.value.trim()){phoneField.classList.add('invalid');return}phoneField.classList.remove('invalid');otpSent=true;sendCode.disabled=true;let t=30;sendCode.textContent=`Resend in ${t}s`;const id=setInterval(()=>{t--;sendCode.textContent=t?`Resend in ${t}s`:'Resend code';if(!t){clearInterval(id);sendCode.disabled=false}},1000);toast('Demo code sent: 123456')}
function verifyOtp(){if(!phone.value.trim()){phoneField.classList.add('invalid');return}if(!otpSent){toast('Send a verification code first');return}if(otp.value!=='123456'){toast('Use demo code 123456');return}verified.classList.add('show');setTimeout(()=>goAccount(3),320)}
function selectType(el){document.querySelectorAll('.account-screen .choice').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');type=el.dataset.type}
function finishType(){sumEmail.textContent=email.value;sumPhone.textContent=`${code.value} ${phone.value}`;const business=type==='business';sumType.textContent=business?'Business':'Individual';doneTitle.textContent=business?'Continue to Business KYB':'Continue to Individual KYC';doneSub.textContent=business?'Your account setup is complete. The next step is company and ownership verification.':'Your account setup is complete. The next step is identity verification.';nextJourney.textContent=business?'Start Business KYB':'Start Individual KYC';goAccount(4)}
function startSelectedJourney(){if(type==='business'){goKyb(1);return}goKyc(1)}
function toggleNationality(){hasOtherNationality=!hasOtherNationality;nationalitySwitch.classList.toggle('on',hasOtherNationality);nationalityPanel.classList.toggle('show',hasOtherNationality)}
function openSdk(){sdkStep=0;sdkModal.classList.add('show');renderSdk()}
function closeSdk(){sdkModal.classList.remove('show')}
function sdkBackdrop(e){if(e.target===e.currentTarget)closeSdk()}
function renderSdk(){const stages=[...document.querySelectorAll('.sdk-stage')],micros=[...document.querySelectorAll('.sdk-modal .micro')];stages.forEach((s,i)=>s.classList.toggle('active',i===sdkStep));micros.forEach((m,i)=>m.classList.toggle('on',i<=sdkStep));sdkDocLabel.textContent=sdkDoc}
function sdkNext(){if(sdkStep<4){sdkStep++;renderSdk()}}
function sdkPrev(){if(sdkStep>0){sdkStep--;renderSdk()}}
function selectSdkDoc(el,doc){el.parentElement.querySelectorAll('.choice').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');sdkDoc=doc}
function completeVerification(){closeSdk();verifyCard.classList.add('complete');verifyStatus.textContent='Verified by Sumsub';startVerification.textContent='Verified by Sumsub';startVerification.disabled=true;identityContinue.disabled=false;toast('Sumsub verification result returned to LCT')}
function buildReview(){rvResidence.textContent=residence.value;rvNationality.textContent=nationality.value;rvAdditional.textContent=hasOtherNationality?`${additionalNationality.value} · ${additionalDocType.value}`:'None';const pepMap={no:'No',self:'Yes — self',related:'Yes — family / close associate'};rvPep.textContent=pepMap[pep.value]||pep.value;rvAddress.textContent=`${address1.value}, ${city.value}, ${addressCountry.value}`}
function toggleEmployerPanel(){const v=document.getElementById('employmentStatus')?.value;const panel=document.getElementById('employerPanel');const title=document.getElementById('employerTitle');if(!panel||!title)return;const show=['employed','self','business'].includes(v);panel.classList.toggle('show',show);if(v==='self')title.textContent='Business / self-employment information';else if(v==='business')title.textContent='Business information';else title.textContent='Employer information'}
function toggleChip(el){el.classList.toggle('selected')}
function toggleMultiChoice(el){el.classList.toggle('selected')}
function selectedText(containerId,selector){const els=[...document.querySelectorAll(`#${containerId} ${selector}.selected`)];return els.map(x=>x.querySelector('h3')?.textContent||x.textContent.trim()).join(', ')}
function buildFpReview(){const statusMap={employed:'Employed',self:'Self-employed',business:'Business owner',student:'Student',retired:'Retired',unemployed:'Unemployed',other:'Other'};fpRvEmployment.textContent=statusMap[employmentStatus.value]||employmentStatus.value;fpRvEmployer.textContent=['employed','self','business'].includes(employmentStatus.value)?(employerName.value||'Not provided'):'Not applicable';fpRvSof.textContent=primarySof.value;fpRvSofCountry.textContent=sofCountry.value;fpRvAnnualDeposit.textContent=annualDeposit.value;fpRvSow.textContent=primarySow.value;fpRvSowCountry.textContent=sowCountry.value;fpRvNetWorth.textContent=netWorth.value;fpRvIncome.textContent=annualIncome.value;fpRvMonthlyDeposit.textContent=monthlyDeposit.value;fpRvPurpose.textContent=selectedText('purposeChips','.chip')||'Trading'}
function submitIndividual(){buildFpReview();goFp(6);toast('Individual KYC submitted for compliance review')}
function simulateApproval(){goFp(7)}
function toggleCorrespondence(){corrDifferent=!corrDifferent;corrSwitch.classList.toggle('on',corrDifferent);corrPanel.classList.toggle('show',corrDifferent)}
function openRoleForm(kind){roleModalTitle.textContent=kind==='UBO'?'Ultimate Beneficial Owner':'Director / authorised representative';roleType.value=kind==='UBO'?'Ultimate Beneficial Owner':'Director';roleName.value='';roleModal.classList.add('show')}
function closeRoleForm(){roleModal.classList.remove('show')}
function roleBackdrop(e){if(e.target===e.currentTarget)closeRoleForm()}
function saveRole(){closeRoleForm();toast('Key role saved. Individual KYC can be triggered for this person.')}
function markUpload(el){if(el.classList.contains('done'))return;el.classList.add('done');el.innerHTML='✓<b>Uploaded</b><span>Document received</span>';uploads++;toast('Document uploaded')}
function buildKybReview(){kybRvName.textContent=kybName.value||'Not provided';kybRvReg.textContent=(kybReg.value||'Not provided')+' · '+kybCountry.value;kybRvPhone.textContent=kybPhone.value||'Not provided';kybRvSof.textContent=companySof.value+' · '+companySofPlace.value;kybRvSow.textContent=companySow.value+' · '+companySowPlace.value;kybRvAum.textContent=companyAum.value;kybRvPep.textContent=`Company: ${companyPep.value} · Key roles: ${rolePep.value}`;kybRvDocs.textContent=`${uploads} / 4 uploaded`;refreshSubmitKyb()}
function refreshSubmitKyb(){const b=document.getElementById('submitKybBtn');if(b)b.disabled=!document.getElementById('kybDeclaration')?.checked}
function submitKyb(){if(!kybDeclaration.checked)return;goKyb(8);toast('KYB application submitted')}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),2200)}
goAccount(1);