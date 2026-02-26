"""
Award Evaluation Engine

Handles criteria checking, tier calculation, and progress tracking for awards.
"""

import re
from typing import Dict, Any, List, Optional, Tuple
from sqlmodel import Session, select, func, desc
from datetime import datetime, timedelta

from app.models.award import AwardTemplate, UserAward, AwardCategory
from app.models.reaction import ReactionCache, Discovery
from app.models.user import User

ELEMENT_PATTERN = re.compile(r'([A-Z][a-z]?)(\d*)')

COMMON_ELEMENTS = {
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pt', 'Au',
    'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac'
}

REACTION_TYPE_KEYWORDS = {
    'combustion': ['combustion', 'burn', 'oxidize', 'oxidation'],
    'synthesis': ['synthesis', 'combine', 'form', 'produce'],
    'decomposition': ['decompose', 'break', 'split', 'dissociate'],
    'single_replacement': ['single', 'replacement', 'displace'],
    'double_replacement': ['double', 'replacement', 'exchange'],
    'acid_base': ['acid', 'base', 'neutralize', 'salt', 'hydroxide', 'hydrogen'],
    'precipitation': ['precipitate', 'insoluble', 'precipitate', 'settle'],
    'redox': ['redox', 'oxidation', 'reduction', 'electron'],
}

EXOTHERMIC_KEYWORDS = ['exothermic', 'heat', 'release', 'fire', 'burn', 'glow', 'hot']
ENDOTHERMIC_KEYWORDS = ['endothermic', 'absorb', 'cool', 'cold', 'heat']


class AwardEvaluationError(Exception):
    """Raised when award evaluation encounters an error."""
    pass


class AwardEvaluator:
    """
    Core award evaluation engine that checks criteria, calculates tiers,
    and tracks progress for award templates.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    async def check_criteria(
        self, 
        template: AwardTemplate, 
        user_id: int, 
        context: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Check if a user meets the criteria for a specific award template.
        
        Args:
            template: The award template to evaluate
            user_id: ID of the user to evaluate
            context: Additional context data for evaluation
            
        Returns:
            True if criteria are met, False otherwise
        """
        if not template.is_active:
            return False
        
        criteria = template.criteria
        criteria_type = criteria.get("type")
        
        if not criteria_type:
            raise AwardEvaluationError(f"Award template {template.id} missing criteria type")
        
        # Get user statistics for evaluation
        user_stats = await self._get_user_statistics(user_id, criteria_type, context)
        
        # Check criteria based on type
        if criteria_type == "discovery_count":
            return await self._check_discovery_count_criteria(criteria, user_stats)
        elif criteria_type == "unique_effects":
            return await self._check_unique_effects_criteria(criteria, user_stats)
        elif criteria_type == "reaction_complexity":
            return await self._check_reaction_complexity_criteria(criteria, user_stats, context)
        elif criteria_type == "debug_submissions":
            return await self._check_debug_submissions_criteria(criteria, user_stats)
        elif criteria_type == "correction_accuracy":
            return await self._check_correction_accuracy_criteria(criteria, user_stats)
        elif criteria_type == "profile_completeness":
            return await self._check_profile_completeness_criteria(criteria, user_stats)
        elif criteria_type == "consecutive_days":
            return await self._check_consecutive_days_criteria(criteria, user_stats)
        elif criteria_type == "unique_elements":
            return await self._check_unique_elements_criteria(criteria, user_stats)
        elif criteria_type == "unique_reaction_types":
            return await self._check_unique_reaction_types_criteria(criteria, user_stats)
        elif criteria_type == "exothermic_reactions":
            return await self._check_thermal_reactions_criteria(criteria, user_stats, "exothermic")
        elif criteria_type == "endothermic_reactions":
            return await self._check_thermal_reactions_criteria(criteria, user_stats, "endothermic")
        elif criteria_type == "acid_base_reactions":
            return await self._check_reaction_type_by_keyword(criteria, user_stats, "acid_base")
        elif criteria_type == "redox_reactions":
            return await self._check_reaction_type_by_keyword(criteria, user_stats, "redox")
        elif criteria_type == "gas_production":
            return await self._check_gas_production_criteria(criteria, user_stats)
        elif criteria_type == "catalyst_reactions":
            return await self._check_catalyst_reactions_criteria(criteria, user_stats)
        else:
            raise AwardEvaluationError(f"Unknown criteria type: {criteria_type}")
    
    async def calculate_progress(
        self, 
        template: AwardTemplate, 
        user_id: int,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculate progress toward earning an award.
        
        Args:
            template: The award template to evaluate
            user_id: ID of the user to evaluate
            context: Additional context data for evaluation
            
        Returns:
            Dictionary containing progress information
        """
        criteria = template.criteria
        criteria_type = criteria.get("type")
        
        if not criteria_type:
            raise AwardEvaluationError(f"Award template {template.id} missing criteria type")
        
        # Get user statistics
        user_stats = await self._get_user_statistics(user_id, criteria_type, context)
        
        # Calculate progress based on criteria type
        progress = {
            "criteria_type": criteria_type,
            "current_value": 0,
            "target_value": criteria.get("threshold", 1),
            "percentage": 0.0,
            "is_complete": False
        }
        
        if criteria_type in ["discovery_count", "debug_submissions", "consecutive_days"]:
            current = user_stats.get("count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "unique_effects":
            current = user_stats.get("unique_effects_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "correction_accuracy":
            accuracy = user_stats.get("accuracy_percentage", 0.0)
            target = criteria.get("threshold", 80.0)
            progress.update({
                "current_value": accuracy,
                "target_value": target,
                "percentage": min(100.0, (accuracy / target) * 100.0),
                "is_complete": accuracy >= target
            })
        elif criteria_type == "profile_completeness":
            completeness = user_stats.get("completeness_percentage", 0.0)
            target = criteria.get("threshold", 100.0)
            progress.update({
                "current_value": completeness,
                "target_value": target,
                "percentage": completeness,
                "is_complete": completeness >= target
            })
        elif criteria_type == "unique_elements":
            current = user_stats.get("unique_elements_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "unique_reaction_types":
            current = user_stats.get("unique_reaction_types_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "exothermic_reactions":
            current = user_stats.get("exothermic_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "endothermic_reactions":
            current = user_stats.get("endothermic_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "acid_base_reactions":
            current = user_stats.get("acid_base_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "redox_reactions":
            current = user_stats.get("redox_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "gas_production":
            current = user_stats.get("gas_reactions_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        elif criteria_type == "catalyst_reactions":
            current = user_stats.get("catalyst_reactions_count", 0)
            target = criteria.get("threshold", 1)
            progress.update({
                "current_value": current,
                "target_value": target,
                "percentage": min(100.0, (current / target) * 100.0),
                "is_complete": current >= target
            })
        
        return progress
    
    async def determine_tier(
        self, 
        template: AwardTemplate, 
        user_stats: Dict[str, Any]
    ) -> int:
        """
        Determine the appropriate tier for an award based on user statistics.
        
        Args:
            template: The award template
            user_stats: User statistics dictionary
            
        Returns:
            Tier number (1-based)
        """
        metadata = template.award_metadata
        tiers = metadata.get("tiers", [])
        
        if not tiers:
            return 1  # Default tier
        
        criteria_type = template.criteria.get("type")
        
        # Get the relevant statistic for tier calculation
        if criteria_type in ["discovery_count", "debug_submissions", "consecutive_days"]:
            stat_value = user_stats.get("count", 0)
        elif criteria_type == "unique_effects":
            stat_value = user_stats.get("unique_effects_count", 0)
        elif criteria_type == "correction_accuracy":
            stat_value = user_stats.get("accuracy_percentage", 0.0)
        elif criteria_type == "profile_completeness":
            stat_value = user_stats.get("completeness_percentage", 0.0)
        elif criteria_type == "unique_elements":
            stat_value = user_stats.get("unique_elements_count", 0)
        elif criteria_type == "unique_reaction_types":
            stat_value = user_stats.get("unique_reaction_types_count", 0)
        elif criteria_type == "exothermic_reactions":
            stat_value = user_stats.get("exothermic_count", 0)
        elif criteria_type == "endothermic_reactions":
            stat_value = user_stats.get("endothermic_count", 0)
        elif criteria_type == "acid_base_reactions":
            stat_value = user_stats.get("acid_base_count", 0)
        elif criteria_type == "redox_reactions":
            stat_value = user_stats.get("redox_count", 0)
        elif criteria_type == "gas_production":
            stat_value = user_stats.get("gas_reactions_count", 0)
        elif criteria_type == "catalyst_reactions":
            stat_value = user_stats.get("catalyst_reactions_count", 0)
        else:
            stat_value = user_stats.get("count", 0)
        
        # Find the highest tier the user qualifies for
        qualified_tier = 1
        for tier in sorted(tiers, key=lambda t: t.get("threshold", 0)):
            threshold = tier.get("threshold", 0)
            if stat_value >= threshold:
                qualified_tier = max(qualified_tier, tiers.index(tier) + 1)
        
        return qualified_tier
    
    async def _get_user_statistics(
        self, 
        user_id: int, 
        criteria_type: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Get user statistics relevant to the criteria type."""
        stats = {}
        
        if criteria_type == "discovery_count":
            # Count total discoveries by user
            discovery_count = self.db.exec(
                select(func.count(Discovery.id)).where(Discovery.discovered_by == user_id)
            ).first() or 0
            stats["count"] = discovery_count
            
        elif criteria_type == "unique_effects":
            # Count unique effects discovered by user
            unique_effects = self.db.exec(
                select(func.count(func.distinct(Discovery.effect)))
                .where(Discovery.discovered_by == user_id)
            ).first() or 0
            stats["unique_effects_count"] = unique_effects
            
        elif criteria_type == "reaction_complexity":
            # Get complexity from context (calculated during reaction processing)
            if context:
                stats["complexity"] = context.get("complexity", 0)
            else:
                stats["complexity"] = 0
                
        elif criteria_type == "debug_submissions":
            stats["count"] = 0
            
        elif criteria_type == "correction_accuracy":
            stats["accuracy_percentage"] = 0.0
            stats["total_submissions"] = 0
            stats["successful_submissions"] = 0
            
        elif criteria_type == "data_quality_impact":
            # Placeholder for data quality impact calculation
            # This would require more complex analysis of data improvements
            stats["impact_score"] = 0
            
        elif criteria_type == "profile_completeness":
            # Check user profile completeness
            user = self.db.exec(select(User).where(User.id == user_id)).first()
            if user:
                completeness = self._calculate_profile_completeness(user)
                stats["completeness_percentage"] = completeness
            else:
                stats["completeness_percentage"] = 0.0
                
        elif criteria_type == "consecutive_days":
            # Calculate consecutive days of activity
            consecutive_days = await self._calculate_consecutive_days(user_id)
            stats["count"] = consecutive_days
            
        elif criteria_type == "help_others":
            stats["help_score"] = 0

        elif criteria_type == "unique_elements":
            stats["unique_elements_count"] = await self._count_unique_elements(user_id)

        elif criteria_type == "unique_reaction_types":
            stats["unique_reaction_types_count"] = await self._count_unique_reaction_types(user_id)

        elif criteria_type == "exothermic_reactions":
            stats["exothermic_count"] = await self._count_thermal_reactions(user_id, "exothermic")

        elif criteria_type == "endothermic_reactions":
            stats["endothermic_count"] = await self._count_thermal_reactions(user_id, "endothermic")

        elif criteria_type == "acid_base_reactions":
            stats["acid_base_count"] = await self._count_reactions_by_keyword(user_id, "acid_base")

        elif criteria_type == "redox_reactions":
            stats["redox_count"] = await self._count_reactions_by_keyword(user_id, "redox")

        elif criteria_type == "gas_production":
            stats["gas_reactions_count"] = await self._count_gas_production_reactions(user_id)

        elif criteria_type == "catalyst_reactions":
            stats["catalyst_reactions_count"] = await self._count_catalyst_reactions(user_id)
        
        return stats
    
    async def _check_discovery_count_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check discovery count criteria."""
        threshold = criteria.get("threshold", 1)
        current_count = user_stats.get("count", 0)
        
        # Check additional conditions if present
        conditions = criteria.get("conditions", [])
        if conditions:
            # Implement condition checking logic here
            pass
        
        return current_count >= threshold
    
    async def _check_unique_effects_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check unique effects criteria."""
        threshold = criteria.get("threshold", 1)
        current_count = user_stats.get("unique_effects_count", 0)
        return current_count >= threshold
    
    async def _check_reaction_complexity_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> bool:
        """Check reaction complexity criteria."""
        threshold = criteria.get("threshold", 1)
        complexity = user_stats.get("complexity", 0)
        return complexity >= threshold
    
    async def _check_debug_submissions_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check debug submissions criteria."""
        threshold = criteria.get("threshold", 1)
        current_count = user_stats.get("count", 0)
        return current_count >= threshold
    
    async def _check_correction_accuracy_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check correction accuracy criteria."""
        threshold = criteria.get("threshold", 80.0)
        accuracy = user_stats.get("accuracy_percentage", 0.0)
        min_submissions = criteria.get("min_submissions", 5)
        total_submissions = user_stats.get("total_submissions", 0)
        
        # Require minimum number of submissions for accuracy calculation
        return total_submissions >= min_submissions and accuracy >= threshold
    
    async def _check_profile_completeness_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check profile completeness criteria."""
        threshold = criteria.get("threshold", 100.0)
        completeness = user_stats.get("completeness_percentage", 0.0)
        return completeness >= threshold
    
    async def _check_consecutive_days_criteria(
        self, 
        criteria: Dict[str, Any], 
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check consecutive days criteria."""
        threshold = criteria.get("threshold", 1)
        consecutive_days = user_stats.get("count", 0)
        return consecutive_days >= threshold
    
    def _calculate_profile_completeness(self, user: User) -> float:
        """Calculate user profile completeness percentage."""
        total_fields = 3  # username, email, and assuming some profile fields
        completed_fields = 0
        
        if user.username and user.username.strip():
            completed_fields += 1
        if user.email and user.email.strip():
            completed_fields += 1
        if user.is_active:  # Basic activity indicator
            completed_fields += 1
        
        return (completed_fields / total_fields) * 100.0
    
    async def _calculate_consecutive_days(self, user_id: int) -> int:
        """Calculate consecutive days of user activity."""
        recent_reactions = self.db.exec(
            select(ReactionCache.created_at)
            .where(ReactionCache.user_id == user_id)
            .order_by(desc(ReactionCache.created_at))
            .limit(30)
        ).all()
        
        if not recent_reactions:
            return 0
        
        activity_dates = set()
        for reaction in recent_reactions:
            if hasattr(reaction, 'date'):
                activity_dates.add(reaction.date())
            else:
                activity_dates.add(reaction)
        
        # Sort dates in descending order
        sorted_dates = sorted(activity_dates, reverse=True)
        
        consecutive_days = 0
        current_date = datetime.utcnow().date()
        
        for date in sorted_dates:
            if date == current_date - timedelta(days=consecutive_days):
                consecutive_days += 1
            else:
                break
        
        return consecutive_days

    async def _check_unique_elements_criteria(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check unique elements criteria."""
        threshold = criteria.get("threshold", 1)
        current_count = user_stats.get("unique_elements_count", 0)
        return current_count >= threshold

    async def _check_unique_reaction_types_criteria(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check unique reaction types criteria."""
        threshold = criteria.get("threshold", 1)
        current_count = user_stats.get("unique_reaction_types_count", 0)
        return current_count >= threshold

    async def _check_thermal_reactions_criteria(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any],
        thermal_type: str
    ) -> bool:
        """Check exothermic or endothermic reaction criteria."""
        threshold = criteria.get("threshold", 1)
        if thermal_type == "exothermic":
            count = user_stats.get("exothermic_count", 0)
        else:
            count = user_stats.get("endothermic_count", 0)
        return count >= threshold

    async def _check_reaction_type_by_keyword(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any],
        reaction_type: str
    ) -> bool:
        """Check reaction type criteria by keyword matching."""
        threshold = criteria.get("threshold", 1)
        if reaction_type == "acid_base":
            count = user_stats.get("acid_base_count", 0)
        elif reaction_type == "redox":
            count = user_stats.get("redox_count", 0)
        else:
            count = 0
        return count >= threshold

    async def _check_gas_production_criteria(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check gas production reaction criteria."""
        threshold = criteria.get("threshold", 1)
        count = user_stats.get("gas_reactions_count", 0)
        return count >= threshold

    async def _check_catalyst_reactions_criteria(
        self,
        criteria: Dict[str, Any],
        user_stats: Dict[str, Any]
    ) -> bool:
        """Check catalyst reaction criteria."""
        threshold = criteria.get("threshold", 1)
        count = user_stats.get("catalyst_reactions_count", 0)
        return count >= threshold

    def _parse_elements_from_formula(self, formula: str) -> set:
        """Parse chemical formula and extract unique elements."""
        elements = set()
        matches = ELEMENT_PATTERN.findall(formula)
        for element, count in matches:
            if element and element in COMMON_ELEMENTS:
                elements.add(element)
        return elements

    async def _count_unique_elements(self, user_id: int) -> int:
        """Count unique chemical elements used by user in reactions."""
        reactions = self.db.exec(
            select(ReactionCache.reactants, ReactionCache.products)
            .where(ReactionCache.user_id == user_id)
        ).all()

        all_elements = set()
        for reactants, products in reactions:
            if reactants:
                for formula in reactants:
                    all_elements.update(self._parse_elements_from_formula(formula))
            if products:
                for product in products:
                    if isinstance(product, dict) and "formula" in product:
                        all_elements.update(self._parse_elements_from_formula(product["formula"]))

        return len(all_elements)

    async def _count_unique_reaction_types(self, user_id: int) -> int:
        """Count unique reaction types discovered by user."""
        reactions = self.db.exec(
            select(ReactionCache.explanation)
            .where(ReactionCache.user_id == user_id)
        ).all()

        discovered_types = set()
        for explanation in reactions:
            if not explanation:
                continue
            explanation_lower = explanation.lower()
            for reaction_type, keywords in REACTION_TYPE_KEYWORDS.items():
                if any(keyword in explanation_lower for keyword in keywords):
                    discovered_types.add(reaction_type)

        return len(discovered_types)

    async def _count_thermal_reactions(self, user_id: int, thermal_type: str) -> int:
        """Count exothermic or endothermic reactions."""
        reactions = self.db.exec(
            select(ReactionCache.effects, ReactionCache.explanation)
            .where(ReactionCache.user_id == user_id)
        ).all()

        count = 0
        keywords = EXOTHERMIC_KEYWORDS if thermal_type == "exothermic" else ENDOTHERMIC_KEYWORDS

        for effects, explanation in reactions:
            if effects and any(keyword in str(effects).lower() for keyword in keywords):
                count += 1
            elif explanation and any(keyword in explanation.lower() for keyword in keywords):
                count += 1

        return count

    async def _count_reactions_by_keyword(self, user_id: int, reaction_type: str) -> int:
        """Count reactions matching specific type keywords."""
        reactions = self.db.exec(
            select(ReactionCache.explanation, ReactionCache.effects)
            .where(ReactionCache.user_id == user_id)
        ).all()

        count = 0
        keywords = REACTION_TYPE_KEYWORDS.get(reaction_type, [])

        for explanation, effects in reactions:
            text_to_check = ""
            if explanation:
                text_to_check += explanation.lower() + " "
            if effects:
                text_to_check += str(effects).lower()

            if any(keyword in text_to_check for keyword in keywords):
                count += 1

        return count

    async def _count_gas_production_reactions(self, user_id: int) -> int:
        """Count reactions that produce gas."""
        reactions = self.db.exec(
            select(ReactionCache.effects)
            .where(ReactionCache.user_id == user_id)
        ).all()

        count = 0
        gas_keywords = ["gas", "bubble", "effervescence", "fizzle", "hydrogen", "oxygen", "carbon dioxide", "nitrogen"]

        for effects in reactions:
            if effects and any(keyword in str(effects).lower() for keyword in gas_keywords):
                count += 1

        return count

    async def _count_catalyst_reactions(self, user_id: int) -> int:
        """Count reactions involving catalysts."""
        reactions = self.db.exec(
            select(ReactionCache.environment)
            .where(ReactionCache.user_id == user_id)
        ).all()

        catalyst_keywords = ["catalyst", "catalyze", "catalytic", "catalysis"]

        count = 0
        for environment in reactions:
            if environment and any(keyword in environment.lower() for keyword in catalyst_keywords):
                count += 1

        return count