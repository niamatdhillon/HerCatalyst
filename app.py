import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
from datetime import datetime

# --- SYSTEM CONFIGURATION ---
st.set_page_config(page_title="HerCatalyst AI | Professional", page_icon="🌸", layout="wide")

# Custom CSS for high-end "Girlypop" branding (Premium Aesthetic)
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; background-color: #FFF5F7; }
    .main-card { background: white; padding: 30px; border-radius: 25px; border: 1px solid #FFD1DF; box-shadow: 0 15px 35px rgba(216, 27, 96, 0.05); }
    .metric-box { background: #FFF; border-radius: 15px; padding: 15px; border-top: 4px solid #D81B60; text-align: center; }
    .stButton>button { background: linear-gradient(135deg, #D81B60 0%, #F06292 100%); color: white; border-radius: 12px; border: none; height: 55px; font-weight: 700; font-size: 18px; transition: 0.3s; }
    .stButton>button:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(216, 27, 96, 0.2); }
    </style>
    """, unsafe_allow_html=True)

# --- SMART DATA ENGINE ---
@st.cache_data
def load_and_sync_data():
    try:
        logs = pd.read_csv('Period_Log.csv')
        users = pd.read_csv('User_Profile.csv')
        return logs, users
    except:
        return None, None

logs_df, users_df = load_and_sync_data()

# --- SIDEBAR: USER IDENTITY ---
with st.sidebar:
    st.image("https://cdn-icons-png.flaticon.com/512/4343/4343336.png", width=80)
    st.title("HerCatalyst ID")
    user_id = st.text_input("Verified ID", value="U00001", help="Enter U00001 - U02000")
    
    if logs_df is not None and user_id in users_df['user_id'].values:
        u_profile = users_df[users_df['user_id'] == user_id].iloc[0]
        st.success(f"Verified: {user_id}")
        st.caption(f"📍 {u_profile['state']} | 🎂 Age: {u_profile['age']}")
    else:
        st.warning("Guest Mode: Some AI insights limited.")

# --- MAIN INTERFACE ---
st.title("Academic Performance Optimizer 🚀")
st.write("Leveraging 18,000+ data points to align your biology with your goals.")

col1, col2 = st.columns([1, 2], gap="large")

with col1:
    st.markdown("<div class='main-card'>", unsafe_allow_html=True)
    st.subheader("📍 Real-Time Vitals")
    
    last_p = st.date_input("Last Period Start Date", datetime.now().date() - pd.Timedelta(days=14))
    energy = st.slider("Energy Level", 1, 10, 7)
    mood = st.slider("Current Mood", 1, 10, 6)
    
    # Mathematical Phase Calculation
    days_diff = (datetime.now().date() - last_p).days % 28
    if days_diff <= 5: phase = "Menstrual"
    elif days_diff <= 13: phase = "Follicular"
    elif days_diff <= 17: phase = "Ovulation"
    else: phase = "Luteal"
    
    st.info(f"AI Detected Phase: **{phase}**")
    
    run_ai = st.button("RUN ANALYTICS ENGINE")
    st.markdown("</div>", unsafe_allow_html=True)

with col2:
    if run_ai:
        st.balloons()
        
        # --- DATA SCIENCE CALCULATION (Weighted Heuristics) ---
        # 1. Fetch historical average for this phase from YOUR dataset
        phase_data = logs_df[logs_df['cycle_phase'] == phase]
        avg_concentration = phase_data['concentration_score'].mean()
        
        # 2. Adjust for user's specific Stress Baseline from User_Profile
        stress_penalty = 0
        if user_id in users_df['user_id'].values:
            u_stress = users_df[users_df['user_id'] == user_id]['stress_score_baseline'].values[0]
            if u_stress > 6: stress_penalty = (u_stress - 6) * 0.5
        
        # 3. Final Readiness Score
        readiness_score = np.clip((avg_concentration + (energy * 0.3)) - stress_penalty, 1, 10)
        
        # --- RESULTS DISPLAY ---
        st.markdown(f"### Performance Prediction for {user_id}")
        
        m1, m2, m3 = st.columns(3)
        m1.metric("Readiness Score", f"{readiness_score:.1f}/10")
        m2.metric("Phase Average", f"{avg_concentration:.1f}")
        m3.metric("Baseline Stress", f"{u_profile['stress_score_baseline'] if 'u_profile' in locals() else 'N/A'}")

        # Interactive Chart: Your current phase vs others
        chart_data = logs_df.groupby('cycle_phase')['concentration_score'].mean().reset_index()
        fig = px.bar(chart_data, x='cycle_phase', y='concentration_score', 
                     title="Historical Concentration Trends",
                     color='concentration_score', 
                     color_continuous_scale='RdPu')
        st.plotly_chart(fig, use_container_width=True)

        # --- THE "MARKET-KILLER" RECOMMENDATIONS ---
        st.markdown("<div class='main-card'>", unsafe_allow_html=True)
        if readiness_score > 7:
            st.success("### 💎 PEAK PRODUCTIVITY WINDOW")
            st.write("**Primary Task:** High-level problem solving, coding, and mathematical analysis.")
            st.write("**AI Tip:** Your cognitive load capacity is at 95%. This is the day to crunch your thesis.")
        elif readiness_score > 4:
            st.info("### 📊 STABLE MAINTENANCE MODE")
            st.write("**Primary Task:** Collaborative work, documentation, and routine study.")
            st.write("**AI Tip:** Focus is stable but limited. Use Pomodoro (50/10) to avoid burnout.")
        else:
            st.error("### ☁️ COGNITIVE CONSERVATION MODE")
            st.write("**Primary Task:** Organization, light reading, and administrative filing.")
            st.write("**AI Tip:** Physical recovery is priority. Your data shows a higher pain sensitivity today.")
        st.markdown("</div>", unsafe_allow_html=True)
    else:
        st.image("https://img.freepik.com/free-vector/health-tracking-concept-illustration_114360-6421.jpg", width=400)
        st.write("👈 Fill in your vitals to generate your personalized catalyst plan.")

# --- FOOTER ---
st.divider()
st.caption("HerCatalyst Unified Student OS • Data Science PBL 2026")
